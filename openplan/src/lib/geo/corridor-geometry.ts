export type CorridorPosition = [number, number] | [number, number, number]

export type CorridorPolygon = {
  type: 'Polygon'
  coordinates: CorridorPosition[][]
}

export type CorridorMultiPolygon = {
  type: 'MultiPolygon'
  coordinates: CorridorPosition[][][]
}

export type CorridorGeometry = CorridorPolygon | CorridorMultiPolygon

export type CorridorGeometryValidation = {
  ok: boolean
  issues: string[]
}

const MIN_RING_POINTS = 4
const EPSILON = 1e-9

function nearlyEqual(a: number, b: number) {
  return Math.abs(a - b) <= EPSILON
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function validatePosition(
  value: unknown,
  context: string,
  issues: string[]
): value is CorridorPosition {
  if (!Array.isArray(value) || value.length < 2) {
    issues.push(`${context}: coordinate must contain at least [lon, lat]`)
    return false
  }

  const [lon, lat] = value
  if (!isFiniteNumber(lon) || !isFiniteNumber(lat)) {
    issues.push(`${context}: lon/lat must be finite numbers`)
    return false
  }

  // Hard WGS84 bounds check. Reject projected/easting-northing style values.
  if (Math.abs(lon) > 180 || Math.abs(lat) > 90) {
    issues.push(
      `${context}: coordinate [${lon}, ${lat}] is outside WGS84 lon/lat bounds; projected CRS is not accepted`
    )
    return false
  }

  return true
}

function validateRing(ring: unknown, context: string, issues: string[]) {
  if (!Array.isArray(ring)) {
    issues.push(`${context}: ring must be an array of coordinates`)
    return
  }

  if (ring.length < MIN_RING_POINTS) {
    issues.push(`${context}: ring must contain at least ${MIN_RING_POINTS} points`)
    return
  }

  for (let i = 0; i < ring.length; i += 1) {
    validatePosition(ring[i], `${context}[${i}]`, issues)
  }

  const first = ring[0]
  const last = ring[ring.length - 1]

  if (Array.isArray(first) && Array.isArray(last)) {
    const [firstLon, firstLat] = first
    const [lastLon, lastLat] = last

    if (
      isFiniteNumber(firstLon) &&
      isFiniteNumber(firstLat) &&
      isFiniteNumber(lastLon) &&
      isFiniteNumber(lastLat)
    ) {
      if (!nearlyEqual(firstLon, lastLon) || !nearlyEqual(firstLat, lastLat)) {
        issues.push(`${context}: ring must be closed (first and last coordinate must match)`)
      }
    }
  }
}

function collectRings(geometry: CorridorGeometry): unknown[][] {
  if (geometry.type === 'Polygon') {
    return geometry.coordinates as unknown[][]
  }

  return geometry.coordinates.flatMap((poly) => poly as unknown[][])
}

export function validateCorridorGeometry(geometry: CorridorGeometry): CorridorGeometryValidation {
  const issues: string[] = []

  if (!geometry || (geometry.type !== 'Polygon' && geometry.type !== 'MultiPolygon')) {
    return {
      ok: false,
      issues: ['geometry type must be Polygon or MultiPolygon'],
    }
  }

  const rings = collectRings(geometry)

  if (rings.length === 0) {
    issues.push('geometry must contain at least one linear ring')
  }

  rings.forEach((ring, index) => validateRing(ring, `ring_${index}`, issues))

  return {
    ok: issues.length === 0,
    issues,
  }
}
