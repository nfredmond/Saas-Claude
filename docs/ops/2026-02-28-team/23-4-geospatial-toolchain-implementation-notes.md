# Lane 23 — Engineering Implementation Notes (CARTO / QGIS / story-pack)

- Date (PT): 2026-02-28
- Owner: Iris (Engineering)
- Scope: Deliverables requested in Lane 23 assignment

## 1) CARTO CLI verify/install path (controlled + documented)

### Verification result
- `carto` command was initially not present.
- Installed via controlled pinned script.
- Current runtime verification:
  - `carto --version` => `v0.1.2`
  - binary path => `/home/nathaniel/.npm-global/bin/carto`

### Controlled install path
- Script added:
  - `openplan/openplan/scripts/setup_carto_cli.sh`
- Behavior:
  - Pins install version (`@carto/carto-cli@0.1.2` by default)
  - Verifies executable path + version
  - Prints explicit auth + validation commands

### Operator commands
```bash
cd /home/nathaniel/.openclaw/workspace/openplan/openplan
./scripts/setup_carto_cli.sh
carto auth login
carto whoami --json
```

---

## 2) QGIS automation path options (CLI vs MCP candidate)

### Current environment verification
- `qgis`: not installed
- `qgis_process`: not installed
- Apt candidate available in host repos (`qgis` package present in apt index)

### Options evaluated

#### Option A — QGIS CLI baseline (recommended now)
- Install QGIS + use `qgis_process run ...` from scripted pipeline steps.
- Pros:
  - deterministic, scriptable, CI-friendly
  - works with existing Python/Make orchestration
  - lowest moving-part count for immediate lane delivery
- Cons:
  - no conversational tool abstraction out of the box

#### Option B — MCP wrapper candidate (phase 2)
- Build a thin MCP server that wraps `qgis_process` commands.
- Pros:
  - better interactive/agent ergonomics
  - richer step-by-step tool UX once stable
- Cons:
  - extra reliability/security surface
  - additional maintenance burden before baseline is proven

### Recommendation
- **Choose Option A now (QGIS CLI baseline)** for Lane 23 execution.
- Defer MCP wrapper to phase 2 after baseline workflows + QA gates stabilize.

---

## 3) `make story-pack` orchestration command skeleton

### Added command skeleton
- Makefile added at:
  - `openplan/openplan/Makefile`
- Story-pack script added at:
  - `openplan/openplan/scripts/make_story_pack.py`

### Command contract
```bash
cd /home/nathaniel/.openclaw/workspace/openplan/openplan
make story-pack JURISDICTION=county_CORRIDOR_ALPHA CORRIDOR=main-street
```

### What it does (skeleton)
1. Runs map-data-pipeline integration exporter:
   - `projects/map-data-pipeline/integration/scripts/run_pipeline.py`
2. Builds unified story-pack manifests from pipeline exports:
   - report manifest
   - web manifest
   - motion/remotion manifest
3. Writes output package to:
   - `openplan/openplan/.artifacts/story-pack/<timestamp>_<jurisdiction>_<corridor>/`

### Output files (initial skeleton)
- `manifest.json`
- `report/report-manifest.json`
- `web/web-manifest.json`
- `motion/remotion-manifest.json`

---

## Path updates delivered
- `openplan/openplan/scripts/setup_carto_cli.sh`
- `openplan/openplan/scripts/make_story_pack.py`
- `openplan/openplan/Makefile`
- `openplan/docs/ops/2026-02-28-team/23-4-geospatial-toolchain-implementation-notes.md`

---

## Current blockers
1. CARTO auth not yet completed (interactive org login still required).
2. QGIS binary toolchain not installed yet (`qgis_process` absent).
3. Story-pack currently ships manifest skeletons only (next step is hooking board/report assembly + publication QA gates).
