# Lane 23 Deliverable 5 — Geospatial Story-Pack End-to-End Test Matrix

Date (PT): 2026-02-28  
Owner: Mateo Ruiz (Assistant Planner)  
Scope: Inputs -> Transforms -> Outputs -> QA decision for report/web/motion story-pack bundles

## 1) Test objective
Validate that one lane run produces deterministic, decision-safe story-pack outputs across all three channels:
- report-grade (PDF/PNG + metrics)
- web-ready (optimized raster/tile metadata + attribution)
- motion-ready (layer stack + scene manifest)

## 2) Stage map (system-under-test)
1. **Intake**: jurisdiction/corridor + geometry + source snapshots
2. **Transform**: QGIS/Census enrichment + derived metrics + cartographic styling
3. **Assembly**: `make story-pack` package structure + manifests
4. **QA gate**: cartographic + accessibility + metadata completeness
5. **Release**: PASS/HOLD decision with caveat notes

---

## 3) End-to-end test matrix

| ID | Stage | Scenario | Input(s) | Expected Output(s) | QA Gate | Priority |
|---|---|---|---|---|---|---|
| E2E-01 | Intake | Baseline county corridor run | Valid AOI polygon + corridor + ACS snapshot IDs | Run accepted; run_id issued; intake manifest populated | PASS if required metadata complete | P0 |
| E2E-02 | Intake | Missing corridor geometry | AOI only (no corridor) | Controlled fallback route (`context-only` maps) + explicit caveat in manifest | PASS_WITH_CAVEATS only | P1 |
| E2E-03 | Intake | Invalid geometry topology | Self-intersecting polygon | Run halted with deterministic error + no partial export publish | HOLD | P0 |
| E2E-04 | Intake | Jurisdiction token mismatch | Unknown `jurisdiction_type` value | Reject with validation error + accepted token list returned | HOLD | P0 |
| E2E-05 | Transform | ACS enrichment success | Valid geography join keys | Derived attributes populated + source timestamp captured | PASS | P0 |
| E2E-06 | Transform | Partial source outage | One optional layer unavailable | Core maps generated; confidence downgraded + caveat block added | PASS_WITH_CAVEATS | P1 |
| E2E-07 | Transform | Classification reproducibility | Fixed style/class break seed | Class breaks stable across reruns | PASS | P0 |
| E2E-08 | Assembly | Full story-pack generation | Successful pipeline run | `report/`, `web/`, `motion/`, `manifest.json` all present | PASS if bundle complete | P0 |
| E2E-09 | Assembly | Report export fidelity | PDF/PNG build step | No clipping; legend/title/disclaimer present in report assets | PASS | P0 |
| E2E-10 | Assembly | Web export readiness | Web raster/metadata step | `web_manifest.json` + attribution + alt text payload generated | PASS | P0 |
| E2E-11 | Assembly | Motion export readiness | Layer export + remotion manifest | Stable extents + transparent layers + `scene-manifest.json` valid | PASS | P0 |
| E2E-12 | QA | Cartographic rubric threshold | Full artifact set | Weighted score >=85/100 + no P0 defect | PASS | P0 |
| E2E-13 | QA | Accessibility contrast check | Final assets | Label/text contrast meets target; failures logged with selector hints | PASS/HOLD by severity | P0 |
| E2E-14 | QA | Metadata/provenance completeness | Final manifests | Inputs/transforms/versions/timestamps/caveats all complete | PASS | P0 |
| E2E-15 | Release | External package release decision | QA outputs + release notes | Decision set to `PASS` or `PASS_WITH_CAVEATS` only if no unresolved P0 | PASS/HOLD | P0 |
| E2E-16 | Reliability | Rerun determinism (same inputs) | Same run config repeated | Hash/manifest consistency within tolerance; delta log empty or explained | PASS | P0 |

---

## 4) Required evidence per test case
- Command and parameters (or UI trigger)
- Input snapshot IDs + timestamps
- Output paths + checksums (where applicable)
- QA verdict (`PASS | PASS_WITH_CAVEATS | HOLD`)
- Issue ID for each failed gate (P0/P1/P2)

## 5) PASS/HOLD policy
- **PASS**: all required outputs generated; no unresolved P0; metadata complete.
- **PASS_WITH_CAVEATS**: no P0, but documented P1 fallback condition (e.g., optional layer outage).
- **HOLD**: any P0 integrity, readability, accessibility, or provenance gap.

## 6) Immediate execution recommendation
Run E2E-01 through E2E-16 on one canary jurisdiction first, then expand to second jurisdiction to confirm cross-context stability.
