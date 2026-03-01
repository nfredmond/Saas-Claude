# Paid-Access Provisioning QA Gate Checklist (PASS/HOLD)

Date (PT): 2026-02-28  
Owner: Owen Park (Associate Planner)  
Source tracker: `21-paid-access-provisioning-execution-tracker.md`

## Scope validated tonight
Required scenarios:
1) Success path  
2) Purchaser-email mismatch  
3) Duplicate webhook/payment events  
4) Idempotency/retry behavior

Evidence reviewed:
- `openplan/src/test/billing-checkout.test.ts`
- `openplan/src/test/billing-webhook-route.test.ts`
- `openplan/src/test/billing-webhook-utils.test.ts`
- `openplan/src/app/api/billing/checkout/route.ts`
- `openplan/src/app/api/billing/webhook/route.ts`
- Test run: `vitest` targeted billing tests = 16/16 pass

---

## QA Gate Matrix

| Scenario | Expected behavior | Evidence status | Gate |
|---|---|---|---|
| Success provisioning | Paid checkout + verified webhook updates correct workspace billing fields (`subscription_status`, `subscription_plan`, Stripe IDs) and marks receipt processed. | Covered in webhook route tests + checkout tests; PASS. | PASS |
| Purchaser-email mismatch | If purchaser email differs from workspace owner/admin email, system should route deterministically (auto-link if policy allows, else manual review + clear fallback message). | **Not explicitly enforced/tested in current route logic.** Checkout prioritizes existing `stripe_customer_id` if present; no explicit mismatch gate. | HOLD |
| Duplicate events | Duplicate Stripe/legacy events should not double-apply entitlements; should return safe duplicate response. | Covered in webhook route tests (duplicate Stripe and duplicate legacy return `200 duplicate`). | PASS |
| Idempotency/retry | Retries should be safe and deterministic; failed events should have a documented replay path. | Idempotency receipt claim/complete exists and duplicate suppression works; however replay policy for failed same-event-id path is not explicitly documented in QA artifacts. | CONDITIONAL / HOLD for production hardening |

---

## PASS/HOLD Recommendation

### Recommendation: **HOLD** (production external rollout gate)

Reason:
1. Purchaser-email mismatch handling is not yet explicit or test-verified.
2. Idempotency/retry replay policy for failed event edge cases needs explicit runbook confirmation.

### Conditional note
- For controlled internal/canary use, current implementation is close and strong on success + duplicate safety.
- For full production confidence, close the two gaps below first.

---

## Required closures to flip HOLD -> PASS

1) **Purchaser-email mismatch control**
- Add deterministic rule + test coverage:
  - allow path (same authorized owner/admin identity) OR
  - manual-review fallback path (no silent auto-link).
- Add explicit onboarding/support message for mismatch delay state.

2) **Failed-event replay policy**
- Document and test replay strategy for `status=failed` webhook receipts:
  - how to safely replay event processing without entitlement duplication,
  - who can trigger replay, and where it is logged.

3) **QA sign-off rerun (quick)**
- Rerun targeted billing tests + one synthetic mismatch simulation + one replay simulation.
- Publish final PASS memo in this ops lane.

---

## Quick execution note for tonight checkpoint
- Technical base: solid
- Production gate posture: HOLD until mismatch + replay controls are explicit and tested
