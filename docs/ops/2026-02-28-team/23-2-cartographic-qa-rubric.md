# Lane 23 Deliverable 2 — Cartographic QA Rubric

- Date (PT): 2026-02-28
- Owner: Priya (GIS)
- Scope: Report, web, and motion-bound map outputs
- Release policy: Council-facing export requires PASS (no unresolved P0)

## 1) Scoring model
- Each category scored 0–5.
- Weighted total score target: **>= 85/100** for external release.
- Any category marked **P0 fail** = automatic NO-GO regardless of score.

## 2) Rubric categories

### A. CRS + spatial integrity (weight 20)
Checks:
- Correct CRS declared and consistent across layers.
- Geometry validity/topology sanity (no null geometry, no critical self-intersections).
- Spatial alignment (base + thematic layers register correctly).

P0 fail examples:
- Unknown/mismatched CRS in final map.
- Geometry corruption that changes interpretation.

### B. Legend + symbology correctness (weight 15)
Checks:
- Legend labels match encoded values.
- Class breaks documented and consistent with methods notes.
- Symbol hierarchy supports intended interpretation.

P0 fail examples:
- Legend values contradict mapped symbols.
- Missing legend for choropleth/risk map.

### C. Readability + visual hierarchy (weight 20)
Checks:
- Title/subtitle clearly state place + metric + timeframe.
- Labels legible at intended output size.
- Key features visible without clutter.
- North arrow/scale bar/context inset where required.

P0 fail examples:
- Illegible labels at published size.
- Ambiguous map purpose due to missing title/context.

### D. Metadata + provenance completeness (weight 20)
Checks:
- Methods version included.
- Source list + fetched timestamps included.
- Jurisdiction type/token included.
- Confidence/caveat statement included.

P0 fail examples:
- Missing data source provenance.
- Missing disclaimer on concept-level output.

### E. Accessibility compliance (weight 15)
Checks:
- Contrast ratio sufficient for major text/symbols.
- Color choices interpretable under common color-vision deficiencies.
- Non-color encodings used where critical.

P0 fail examples:
- Critical map meaning depends only on non-distinguishable color classes.

### F. Export fidelity + format readiness (weight 10)
Checks:
- PDF/PNG/SVG exports preserve symbol/text integrity.
- Web tiles/assets render without clipping/aliasing defects.
- Motion layer exports have stable extents and clean transparency.

P0 fail examples:
- Export truncates map/legend or distorts scale context.

## 3) QA severity labels
- **P0**: external release blocker
- **P1**: release allowed only with explicit caveat
- **P2**: non-blocking polish

## 4) Required QA log fields
- `artifact_id`
- `jurisdiction_type`
- `reviewer`
- `rubric_scores` (category-level)
- `p0_issues[]`
- `p1_issues[]`
- `final_status` (`PASS|PASS_WITH_CAVEATS|NO_GO`)
- `timestamp`

## 5) Minimum external release conditions
1. Total score >= 85/100
2. No unresolved P0 defects
3. Metadata/provenance block present
4. Accessibility checks pass
5. Decision-use disclaimer present
