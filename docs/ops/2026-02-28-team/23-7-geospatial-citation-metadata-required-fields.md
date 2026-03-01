# 23-7 — Required Metadata Fields for Defensible Geospatial Citation

Date: 2026-02-28 (PT)  
Owner: Owen Park (Associate Planner)  
Applies to: client packets, grant narratives, board/council memo attachments

Purpose: define minimum metadata needed so map-driven claims are auditable and client-safe.

---

## A) Required core fields (minimum set)

| Field | Required | Description |
|---|---|---|
| `asset_id` | Yes | Unique ID used in packet references (e.g., MAP-01). |
| `asset_title` | Yes | Human-readable map title in deliverable. |
| `jurisdiction` | Yes | Agency/location scope for map validity. |
| `analysis_extent` | Yes | Corridor/area boundary description. |
| `dataset_sources` | Yes | Source list with provider + dataset name + version/year. |
| `data_pull_timestamp_utc` | Yes | Exact extraction time for reproducibility. |
| `crs` | Yes | Coordinate reference system used in final map. |
| `processing_steps_summary` | Yes | Brief transform summary (joins, filters, normalization). |
| `key_fields_used` | Yes | Primary fields driving mapped claim(s). |
| `confidence_rating` | Yes | High/Medium/Low evidence confidence. |
| `limitations_note` | Yes | Known caveats and what is not represented. |
| `prepared_by` | Yes | Responsible preparer (person/role). |
| `qa_reviewer` | Yes | Reviewer name/role and date. |
| `packet_citation_tag` | Yes | Inline tag used in narrative/memo (`[SRC-##]`). |

---

## B) Recommended extended fields
- `map_style_version`
- `symbolization_rule_set`
- `accessibility_contrast_check`
- `export_hash` (file hash for integrity)
- `related_motion_asset_ids`
- `related_web_asset_ids`

---

## C) Citation syntax standard
In narrative/memo text, cite as:
- `[SRC-07 | MAP-02]` for map evidence,
- `[SRC-07 | MAP-02 | CONF:Med]` when confidence disclosure is needed inline.

---

## D) PASS/HOLD metadata gate
PASS only if:
- [ ] all required fields populated,
- [ ] source/date/version traceable,
- [ ] limitations explicitly stated,
- [ ] citation tags resolve to asset records,
- [ ] QA reviewer sign-off present.

HOLD if any required field is missing or ambiguous.
