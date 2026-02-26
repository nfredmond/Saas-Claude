# OpenPlan 7-Day Execution Plan (Locked)

**Locked on:** 2026-02-25 (PST)
**Owner lane:** OpenPlan (primary)
**Backup lane:** Website ops/intake reliability (only if OpenPlan blockers require waiting)

## Top 5 Backlog Items (Execution Order)

### 1) Report export reliability (HTML + PDF from saved run)
- **Owner:** Marcus (Engineering), support: Owen (coordination)
- **Acceptance criteria:**
  - `POST /api/report` returns `200` for `format=html` and `format=pdf` on valid `runId`.
  - Export payload includes analysis scores, equity/safety sections, AI narrative, and generated timestamp.
  - `src/test/report-route.test.ts` passes all cases.

### 2) Walk/Bike isochrone accessibility scoring hardening
- **Owner:** Marcus + Iris
- **Acceptance criteria:**
  - Corridor analysis includes deterministic walk/bike access tier + score contribution.
  - Rationale text is returned with each analysis response.
  - `src/test/isochrone-accessibility.test.ts` remains green and covers low/medium/high tiers.

### 3) Pilot tenant onboarding + workspace bootstrap (under 10 minutes)
- **Owner:** Evelyn
- **Acceptance criteria:**
  - Authenticated bootstrap endpoint provisions workspace + owner membership idempotently.
  - Runbook supports a complete pilot setup in under 10 minutes by a non-engineer operator.
  - Test coverage remains green for workspace bootstrap route behavior.

### 4) Data quality/source transparency panel in UI + report
- **Owner:** Sofia
- **Acceptance criteria:**
  - UI and exported report both show source/fallback status for Census, crashes, LODES, equity, and AI.
  - Values are consistent between dashboard and exports for the same run.
  - Missing sources show explicit fallback text (no silent substitution).

### 5) Billing skeleton (Starter/Pro) with workspace entitlement
- **Owner:** Marcus
- **Acceptance criteria:**
  - Starter and Pro checkout sessions can be created from billing UI.
  - Webhook updates workspace subscription status.
  - Protected features honor entitlement state (active, trial, inactive).

## 7-Day Execution Calendar

- **Day 1 (today/night):** Baseline validation + unblock failing report-route tests; confirm defect owner and patch plan.
- **Day 2:** Ship report route fix; re-run lint/test/build; verify HTML/PDF export end-to-end.
- **Day 3:** Harden bootstrap flow and runbook timing proof (<10 min provisioning).
- **Day 4:** Implement data transparency panel and align report rendering fields.
- **Day 5:** Wire billing checkout/webhook path; validate entitlement persistence.
- **Day 6:** Regression sweep (analysis/report/billing/bootstrap), polish UX copy, and update runbook docs.
- **Day 7:** Release-readiness review with risk burndown, go/no-go recommendation, and next sprint carryovers.

## Backup Lane Trigger (Website Ops/Intake)
Use backup lane only if OpenPlan work is blocked >2 hours by credentials, environment, or external dependencies. If triggered, execute high-value reliability tasks only (lead intake API checks, inbox auth/session verification, spam-control regression), then return to OpenPlan lane.