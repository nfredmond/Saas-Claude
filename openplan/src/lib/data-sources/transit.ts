/**
 * Transit accessibility helper (MVP)
 *
 * Uses OpenStreetMap Overpass API to count transit stops and stations
 * within the corridor bounding box. This provides a lightweight proxy
 * for GTFS accessibility until full GTFS feed ingestion lands.
 */

export interface TransitAccessSummary {
  totalStops: number;
  busStops: number;
  railStations: number;
  ferryStops: number;
  stopsPerSqMile: number;
  accessTier: "high" | "medium" | "low";
  source: "osm-overpass" | "estimate";
}

interface BBox {
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
}

function bboxAreaSqMiles(bbox: BBox): number {
  const latMid = (bbox.minLat + bbox.maxLat) / 2;
  const latDist = Math.abs(bbox.maxLat - bbox.minLat) * 69.0;
  const lonDist = Math.abs(bbox.maxLon - bbox.minLon) * 69.0 * Math.cos((latMid * Math.PI) / 180);
  return Math.max(0.01, latDist * lonDist);
}

function classifyTier(stopsPerSqMile: number): "high" | "medium" | "low" {
  if (stopsPerSqMile >= 8) return "high";
  if (stopsPerSqMile >= 3) return "medium";
  return "low";
}

export async function fetchTransitAccessForBbox(bbox: BBox): Promise<TransitAccessSummary> {
  const area = bboxAreaSqMiles(bbox);

  // Overpass QL (bbox ordering: south,west,north,east)
  const query = `
[out:json][timeout:20];
(
  node["highway"="bus_stop"](${bbox.minLat},${bbox.minLon},${bbox.maxLat},${bbox.maxLon});
  node["public_transport"="stop_position"](${bbox.minLat},${bbox.minLon},${bbox.maxLat},${bbox.maxLon});
  node["railway"="station"](${bbox.minLat},${bbox.minLon},${bbox.maxLat},${bbox.maxLon});
  node["amenity"="ferry_terminal"](${bbox.minLat},${bbox.minLon},${bbox.maxLat},${bbox.maxLon});
);
out tags center;
`;

  try {
    const resp = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
      signal: AbortSignal.timeout(15000),
    });

    if (!resp.ok) throw new Error(`Overpass HTTP ${resp.status}`);

    const data = (await resp.json()) as {
      elements?: Array<{ tags?: Record<string, string> }>;
    };

    const elements = data.elements ?? [];
    let busStops = 0;
    let railStations = 0;
    let ferryStops = 0;

    for (const el of elements) {
      const tags = el.tags ?? {};
      if (tags.highway === "bus_stop" || tags.public_transport === "stop_position") {
        busStops += 1;
      }
      if (tags.railway === "station") {
        railStations += 1;
      }
      if (tags.amenity === "ferry_terminal") {
        ferryStops += 1;
      }
    }

    const totalStops = busStops + railStations + ferryStops;
    const stopsPerSqMile = Math.round((totalStops / area) * 10) / 10;

    return {
      totalStops,
      busStops,
      railStations,
      ferryStops,
      stopsPerSqMile,
      accessTier: classifyTier(stopsPerSqMile),
      source: "osm-overpass",
    };
  } catch {
    // Fallback estimate for resilience
    const estStops = Math.max(1, Math.round(area * 2.5));
    const stopsPerSqMile = Math.round((estStops / area) * 10) / 10;

    return {
      totalStops: estStops,
      busStops: Math.round(estStops * 0.85),
      railStations: Math.round(estStops * 0.1),
      ferryStops: Math.round(estStops * 0.05),
      stopsPerSqMile,
      accessTier: classifyTier(stopsPerSqMile),
      source: "estimate",
    };
  }
}
