# Lane 23 Deliverable 6 — Story-Pack Packaging Checklist (Report / Web / Motion)

Date (PT): 2026-02-28  
Owner: Mateo Ruiz (Assistant Planner)

## 1) Packaging objective
Ship one reproducible, handoff-safe bundle containing report/web/motion artifacts plus canonical metadata.

## 2) Canonical package structure

```text
story-pack/<run_id>/
  manifest.json
  release_notes.md
  qa/
    qa-summary.md
    issues.csv
  report/
    maps_pdf/
    maps_png/
    metrics.csv
    methods_appendix.md
  web/
    raster/
    vector_or_tiles/ (optional)
    web_manifest.json
    attribution.md
    alt_text.md
  motion/
    layers/
    scene-manifest.json
    cue-sheet.md
  provenance/
    inputs.json
    transforms.json
    env_versions.json
    checksums.sha256
```

---

## 3) End-of-run packaging checklist

### A. Root bundle integrity
- [ ] `run_id` folder created and timestamped.
- [ ] `manifest.json` exists at root.
- [ ] `release_notes.md` includes decision-use disclaimer.
- [ ] `qa/qa-summary.md` and `qa/issues.csv` are present.

### B. Report bundle
- [ ] Final map PDFs exported at publication resolution.
- [ ] Companion PNGs generated for deck/doc embeds.
- [ ] `metrics.csv` included and schema-documented.
- [ ] `methods_appendix.md` includes methods version and caveats.

### C. Web bundle
- [ ] Web-optimized assets exported (`web/raster/`).
- [ ] Tile/vector metadata included when applicable.
- [ ] `web_manifest.json` includes layer IDs and style references.
- [ ] `attribution.md` includes source and license requirements.
- [ ] `alt_text.md` includes concise map description text.

### D. Motion bundle
- [ ] Layer set exported to `motion/layers/`.
- [ ] `scene-manifest.json` generated and valid.
- [ ] `cue-sheet.md` maps scene IDs to narrative beats.
- [ ] Layer extents/alpha channels validated (no clipping/artifacts).

### E. Provenance + compliance
- [ ] `provenance/inputs.json` lists source snapshots + timestamps.
- [ ] `provenance/transforms.json` lists processing steps.
- [ ] `provenance/env_versions.json` lists runtime tool versions.
- [ ] `provenance/checksums.sha256` generated for all delivered artifacts.

### F. QA decision gate
- [ ] Cartographic rubric score attached.
- [ ] Accessibility/contrast check results attached.
- [ ] Metadata completeness check attached.
- [ ] Final decision recorded: `PASS | PASS_WITH_CAVEATS | HOLD`.

---

## 4) Packaging severity labels
- **P0**: missing critical artifact/manifest/provenance -> HOLD
- **P1**: non-blocking but release-note caveat required -> PASS_WITH_CAVEATS
- **P2**: polish-only issue -> PASS allowed

## 5) Client handoff minimum set
- `manifest.json`
- report maps + metrics + methods appendix
- web manifest + attribution + alt text
- motion scene manifest + cue sheet
- QA summary + issue log
- checksums file

If any of the above is missing, handoff is incomplete and must remain HOLD.
