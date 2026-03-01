# Lane 23 Deliverable 7 — Story-Pack Reproducibility Checklist

Date (PT): 2026-02-28  
Owner: Mateo Ruiz (Assistant Planner)  
Scope: Rerun determinism + manifest completeness + auditability

## 1) Reproducibility definition (lane standard)
A run is reproducible when the same inputs + config + versions produce the same decision-relevant outputs (or a documented, acceptable delta) and full provenance can be audited.

## 2) Determinism checks (required)

### A. Run configuration lock
- [ ] `run_config.json` captured (jurisdiction, corridor, class breaks, output profile).
- [ ] Seed/ordering controls captured where stochastic behavior exists.
- [ ] CRS and projection parameters captured explicitly.

### B. Input snapshot lock
- [ ] Source dataset IDs and fetch timestamps recorded.
- [ ] Geometry input file hashes recorded.
- [ ] External API response snapshot hashes recorded (where used).

### C. Environment/version lock
- [ ] Tool versions captured (QGIS/CARTO/Python/Node/Remotion/etc.).
- [ ] Style/template version IDs captured.
- [ ] Runtime OS/container hash captured (if applicable).

### D. Output repeatability
- [ ] Repeat run executed with identical config.
- [ ] Output checksums compared (`checksums.sha256`).
- [ ] Determinism verdict recorded:
  - `MATCH`
  - `MATCH_WITH_ACCEPTABLE_DELTA`
  - `MISMATCH_HOLD`

---

## 3) Manifest completeness checklist

### Required root fields (`manifest.json`)
- [ ] `run_id`
- [ ] `created_at_pt`
- [ ] `jurisdiction_type`
- [ ] `jurisdiction_name`
- [ ] `corridor_name`
- [ ] `methods_version`
- [ ] `qa_status`
- [ ] `confidence_label`
- [ ] `disclaimer_block`

### Required sections
- [ ] `inputs[]` with source + timestamp + hash
- [ ] `transforms[]` with ordered step list
- [ ] `outputs.report[]`
- [ ] `outputs.web[]`
- [ ] `outputs.motion[]`
- [ ] `issues[]` with severity and disposition
- [ ] `checksums_ref`

### Required decision metadata
- [ ] PASS/HOLD decision timestamp
- [ ] reviewer name/role
- [ ] unresolved issue list (if any)
- [ ] release-caveat list (if PASS_WITH_CAVEATS)

---

## 4) Repro run protocol
1. Freeze inputs/config/version snapshot.
2. Execute baseline run and archive outputs/checksums.
3. Execute rerun with no changes.
4. Compare checksums + render-critical metadata.
5. Log diff report:
   - no diff -> MATCH
   - benign timestamp-only diff -> MATCH_WITH_ACCEPTABLE_DELTA
   - symbol/geometry/metric diff -> MISMATCH_HOLD

---

## 5) HOLD triggers (automatic)
- Missing input or transform provenance.
- Missing or inconsistent checksums.
- Unexplained output differences affecting map meaning.
- Missing disclaimer/caveat in final manifest.
- Missing QA decision metadata.

## 6) PASS conditions
- Determinism verdict is MATCH or MATCH_WITH_ACCEPTABLE_DELTA.
- Manifest completeness = 100% required fields/sections.
- No unresolved P0 issue in QA summary.
- Repro report attached to package.

## 7) Suggested repro report artifact
- `qa/reproducibility-report.md` containing:
  - baseline run ID
  - rerun ID
  - checksum diff summary
  - any accepted deltas
  - final repro verdict
