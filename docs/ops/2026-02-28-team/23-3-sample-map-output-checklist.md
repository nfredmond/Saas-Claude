# Lane 23 Deliverable 3 — Sample Map Output Checklist (Report / Web / Motion)

- Date (PT): 2026-02-28
- Owner: Priya (GIS)
- Purpose: One checklist that can drive export packaging for report, web, and motion use.

## 1) Run metadata (required)
- [ ] Run ID assigned
- [ ] Methods version recorded
- [ ] Jurisdiction token recorded (`city|county|county-equivalent|tribal-government|regional-commission|state-agency`)
- [ ] Data source snapshots + fetch timestamps attached
- [ ] Confidence/caveat label attached

## 2) Core map set produced
- [ ] `map_context_nodes`
- [ ] `map_crossing_exposure`
- [ ] `map_ada_continuity`
- [ ] `map_curb_conflicts`
- [ ] `map_phase_focus` (A/B as scoped)

## 3) Cartographic QA gate
- [ ] CRS/spatial integrity pass
- [ ] Legend/symbology pass
- [ ] Readability pass
- [ ] Metadata/provenance pass
- [ ] Accessibility pass
- [ ] No unresolved P0 issues

## 4) Report export package
- [ ] PDF maps exported at publication resolution
- [ ] PNG companions exported for slide/doc embedding
- [ ] Metrics CSV exported
- [ ] Methods appendix exported
- [ ] Standard decision-use disclaimer included

Output path template:
`packs/<YYYYMMDD>_<jurisdiction>_<corridor>/01_maps_pdf/`

## 5) Web export package
- [ ] Web-optimized PNGs generated
- [ ] Tile/style/layer metadata manifest generated
- [ ] Attribution + source block included
- [ ] Accessibility alt text/captions prepared

Output path template:
`packs/<YYYYMMDD>_<jurisdiction>_<corridor>/02_maps_png/` + `web_manifest.json`

## 6) Motion export package
- [ ] Layered SVG/PNG set generated
- [ ] Stable extents and transparent backgrounds verified
- [ ] Scene manifest generated for Remotion pipeline
- [ ] Narration cue notes linked to map sequence

Output path template:
`packs/<YYYYMMDD>_<jurisdiction>_<corridor>/motion/`

## 7) Final release gate
- [ ] QA status = PASS or PASS_WITH_CAVEATS (no P0)
- [ ] Caveats explicitly listed in release notes
- [ ] Council/report/web/motion package index complete
- [ ] Handoff note includes jurisdiction-specific constraints (if any)

## 8) Sample release notes disclosure block
"Concept-level planning analytics for direction-setting only; not survey, engineering, or construction documents. Spatial outputs and quantified metrics are preliminary and subject to field verification, technical refinement, and jurisdiction-specific data limitations."
