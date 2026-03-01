# Lane 23 Deliverable 1 — QGIS + Census Workflow Spec (Nationwide U.S.)

- Date (PT): 2026-02-28
- Owner: Priya (GIS)
- Scope: County, county-equivalent, tribal, RTPA/regional commission, and state agency contexts
- Methods version: `openplan-gis-methods-v0.3-draft`

## 1) Objective
Define a reproducible QGIS + Census workflow that can generate planning-grade map/metric outputs across U.S. jurisdictions, while preserving jurisdiction-specific caveats and traceability.

## 2) Jurisdiction model (required)
Use one `jurisdiction_type` token per run:
- `municipality`
- `county`
- `county-equivalent` (parish, borough/census area, municipio, independent city)
- `tribal-government`
- `regional-commission` (MPO/RTPA/TC)
- `state-agency` (state DOT, etc.)

Required metadata fields in run manifest:
- `jurisdiction_type`
- `jurisdiction_name`
- `state_or_territory`
- `governing_data_authority`
- `data_confidence_label` (`high|medium|low`)

## 3) Input requirements
### Geometry inputs
- AOI boundary (`Polygon`/`MultiPolygon`, WGS84 lon/lat)
- Optional corridor centerline (`LineString`/`MultiLineString`)
- Optional node points (schools, civic centers, transit hubs)

### Source inputs
- U.S. Census ACS (county or tract level as available)
- Jurisdiction-specific crash/safety source adapter (state/local if available; national fallback if not)
- Transit source adapter (GTFS/OSM/local feed)
- Optional local layers (sidewalk, curb use, ADA audits)

### Tribal-context requirement
If `jurisdiction_type=tribal-government`, include:
- data authority note,
- any sovereignty/permission constraints,
- explicit "data availability limitation" statement if applicable.

## 4) QGIS processing pipeline
### Stage A — Intake and normalization
1. Validate geometry type + WGS84 bounds.
2. Normalize schema to canonical field names.
3. Assign run IDs + source snapshot timestamps.

### Stage B — Data enrichment
1. Join ACS attributes by geography key.
2. Join safety/transit/equity inputs by spatial relation.
3. Compute derived fields for priority scoring.

### Stage C — Metric derivation
Compute baseline metrics (v0.3 draft):
- severe conflict exposure index (0–100)
- high-comfort crossing opportunity count
- ADA continuity share
- curb conflict hotspot count
- intervention coverage score

### Stage D — Cartographic production
Generate map classes:
1. context + nodes
2. crossing exposure
3. ADA continuity
4. curb conflicts
5. phase focus block(s)

### Stage E — Export packaging
Export to:
- report: PDF + PNG
- web: optimized PNG + style metadata + optional tile/layer package
- motion: SVG/PNG layer stack + scene manifest

## 5) Census integration pattern
- Preferred baseline: ACS 5-year table pull with explicit year stamp.
- Required metadata per map/table:
  - Census table IDs used,
  - release year,
  - pull timestamp,
  - aggregation geography.
- If tract-level unavailable or unsuitable, allow county-level fallback with confidence downgrade.

## 6) QA gates (workflow-level)
Run is PASS only when all are true:
1. Geometry gate passes (CRS + topology sanity for provided layers).
2. Data-source provenance complete.
3. Cartographic QA rubric score >= release threshold.
4. Accessibility checks pass (contrast/readability).
5. Metadata + disclaimer blocks present in all exports.

## 7) Required caveat statements
- Concept-level outputs are not engineering/construction documents.
- Metrics are preliminary pending field validation.
- Fallback data sources must be explicitly labeled with reduced confidence.

## 8) Constraints (current)
1. State-by-state crash depth uneven outside configured adapters.
2. Some tribal contexts require custom authority-dependent data handling.
3. Canonical local curb/ADA layers may be missing in early-stage jurisdictions.
