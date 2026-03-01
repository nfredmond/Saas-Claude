# Lane 23 — Geospatial Story Fabric (QGIS + Census + Mapbox + Excalidraw + Remotion)

Date: 2026-02-28 (PT)
Owner: Bartholomew Hale (COO)
Requester: Nathaniel Ford Redmond (CEO)
Status: ACTIVE (P2 innovation lane, while P0 paid-access reliability remains primary)

---

## 1) Purpose
Create a production lane that turns real GIS analysis into:
1) council/report-grade maps,
2) web-ready map assets (Mapbox/static + interactive),
3) motion-ready visuals for outreach videos,
4) reproducible delivery packages for client handoff.

---

## 2) Direct answer to your questions

### A) “What was the motion command line for Colgate color grade?”
The script name was:
- `scripts/colgate_color_correct.sh`

Example command:
```bash
./scripts/colgate_color_correct.sh --look cinematic --seconds 8 --limit 2 --dry-run
```

Example output shape:
```text
skip  DJI_20260226164907_0012_D.MP4 -> .../graded/cinematic/DJI_..._cinematic.mp4
skip  DJI_20260226164948_0013_D.MP4 -> .../graded/cinematic/DJI_..._cinematic.mp4
Color correction run complete
  Look: cinematic
  Input: .../projects/colgate-project/footage/colgate-today
  Output: .../projects/colgate-project/graded/cinematic
  LUT: (none, using fallback FFmpeg preview grade)
  Seconds cap: 8
  Seen: 2
  Generated: 0
  Skipped: 2
  Failed: 0
  Dry run: yes
```

### B) “Do we have Excalidraw examples?”
Yes:
- Quickstart: `docs/excalidraw_mcp_quickstart.md`
- Example JSON: `templates/excalidraw_elements_sample.json`
- Helper: `scripts/excalidraw_mcp_helper.py`

### C) “Do we have QGIS MCP yet?”
Not yet in active MCP stack.
- Current MCP servers in `mcporter list`: filesystem, fetch, excalidraw, stripe, github, x, supabase, supabase-nfpa, vercel.
- No `qgis` server currently configured.

### D) “CARTO command line?”
Not installed yet (`carto` command not found in current runtime).
- We should run a controlled installation + auth lane next.

### E) “Mapbox key stored somewhere?”
Yes (without exposing secrets):
- Vercel env vars exist for `MAPBOX_TOKEN` and `MAPBOX_ACCESS_TOKEN` (dev/preview/prod) on the website project.
- Runtime lookup supports aliases in `src/app/api/maps/preview/route.ts`.

---

## 3) What we already have (usable now)

1. **Map→video integration scaffold**
   - `agents/team/expert-programmer/projects/map-data-pipeline/integration/README.md`
   - `.../integration/docs/runbook.md`
   - `.../integration/scripts/run_pipeline.py`

2. **Remotion bridge outputs**
   - `projects/map-data-pipeline/exports/remotion/scene-manifest.json`
   - `projects/map-data-pipeline/integration/remotion/public/map-layers/*.svg`

3. **Excalidraw bridge outputs**
   - `projects/map-data-pipeline/exports/visual-boards/layers/svg/*.svg`
   - `integration/excalidraw/board-package.example.json`

4. **Census + Mapbox in website path**
   - Planner AI uses Census context
   - Grant-lab map preview API is live (`/api/maps/preview`)

---

## 4) Gaps to close

1. QGIS desktop automation path not connected (no QGIS CLI / no QGIS MCP configured).
2. CARTO CLI not installed/authenticated.
3. No single "one-command" pipeline from GIS analysis -> report/web/video asset pack.
4. No quality gate combining cartographic QA + motion QA + accessibility checks.

---

## 5) Surprise addition (high ROI)

## Product idea: **Council Story Engine™**
A repeatable pipeline that accepts a jurisdiction + corridor + goals and auto-produces:
- board-ready map plates (PDF/SVG/PNG),
- web map assets (Mapbox/static previews),
- 30–60s motion explainer clip (Remotion),
- narrative-ready metadata packet for grant/report sections.

This is the missing bridge between analysis and persuasion—and hard to replicate quickly.

---

## 6) First execution block (24–48h)

1. Confirm QGIS automation baseline (CLI or MCP path selection).
2. Install/auth CARTO CLI in controlled sandbox and document exact commands.
3. Build `make story-pack` command that generates:
   - `report/` assets,
   - `web/` assets,
   - `motion/` assets,
   - `manifest.json` with provenance.
4. Add QA gate:
   - CRS/projection check,
   - legend/title/readability check,
   - color-contrast/accessibility check,
   - metadata completeness check.

---

## 7) Ownership / delegation map

- **Elena (Principal Planner):** lane governance + go/no-go gates
- **Priya (GIS Expert):** QGIS/Census analysis standards + map QA rubric
- **Iris (Expert Programmer):** pipeline orchestration + CARTO/QGIS integration + CLI tooling
- **Camila (Urban Design):** visual style system for report/web/motion map assets
- **Owen (Associate Planner):** narrative templates mapping map outputs to policy/grant language
- **Mateo (Assistant Planner):** test matrix + artifact packaging + reproducibility checks

---

## 8) Success criteria (first milestone)

- One jurisdiction test run produces all four asset classes in <20 minutes.
- Full provenance manifest is generated (inputs, transforms, outputs, timestamps).
- QA gate returns PASS with no manual patching for baseline scenario.
- Output packet is immediately usable in a report section + website section + short motion clip.


## 9) Lane 23 deliverables (2026-02-28 update)
- `23-1-qgis-census-workflow-spec.md`
- `23-2-cartographic-qa-rubric.md`
- `23-3-sample-map-output-checklist.md`
- `23-4-geospatial-toolchain-implementation-notes.md`
- `23-5-story-pack-e2e-test-matrix.md`
- `23-6-story-pack-packaging-checklist.md`
- `23-7-story-pack-reproducibility-checklist.md`

Status:
- GIS method framing + QA + multi-channel export checklist: Draft v1 complete.
- Engineering scaffolding: CARTO CLI controlled install path + QGIS path decision + `make story-pack` skeleton drafted.
- QA/test-packaging/repro lane (Mateo): Draft v1 complete for end-to-end matrix + packaging + reproducibility controls.
