# Iris Chen — Day 1 Task Board (OpenPlan)

Date: 2026-02-25  
Owner: Iris Chen  
Project: `openplan/openplan`

## Objective
Move billing from robust scaffold to production-grade Stripe operation with deterministic webhook safety and clear entitlement controls.

---

## Task 1 — Stripe Checkout Session (native)

### File targets
- `src/app/api/billing/checkout/route.ts`
- `src/lib/billing/*` (new helper if needed)
- `src/app/(workspace)/billing/page.tsx` (status text alignment)

### Acceptance checks
- [ ] Checkout route creates **native Stripe Checkout Session** (not payment-link only).
- [ ] Session metadata includes at least:
  - `workspaceId`
  - `plan`
  - `initiatedByUserId`
- [ ] Route returns/redirects to session URL and preserves current API compatibility.
- [ ] Owner/admin authorization behavior unchanged.
- [ ] Unit tests cover successful session creation + auth failure paths.

---

## Task 2 — Webhook replay/idempotency integration tests

### File targets
- `src/test/billing-webhook-route.test.ts`
- `src/app/api/billing/webhook/route.ts` (only if fixes needed)

### Acceptance checks
- [ ] Route test validates strict-mode behavior when Stripe verify fails in production.
- [ ] Route test validates duplicate replay short-circuit (`200`, `duplicate: true`).
- [ ] Route test validates successful processed path updates receipt status.
- [ ] Tests are deterministic (no real network Stripe calls).

---

## Task 3 — Stripe signature strictness rollout policy

### File targets
- `src/app/api/billing/webhook/route.ts`
- `.env.example`
- `docs/SPRINT1_PROGRESS_2026-02-25-billing-webhook-robustness.md`

### Acceptance checks
- [ ] Production defaults to strict Stripe verification.
- [ ] Guarded fallback behavior is explicit and environment-gated.
- [ ] Env documentation includes exact variables and safe defaults.

---

## Task 4 — Entitlement matrix centralization

### File targets
- `src/lib/billing/limits.ts`
- `src/lib/billing/subscription.ts`
- `src/app/api/analysis/route.ts`
- `src/app/(workspace)/dashboard/page.tsx` (optional visibility)

### Acceptance checks
- [ ] Plan limits are centralized and reused (no duplicated literals).
- [ ] Analysis gate emits clear, client-safe error messages.
- [ ] Dashboard can display effective plan limit context (optional but preferred).

---

## Definition of Done (Day 1)
- [ ] All modified code builds: `npm run build`
- [ ] Billing tests pass (new + existing relevant): `vitest` targeted runs
- [ ] Changes committed with scoped message(s)
- [ ] Deployed to `openplan-zeta.vercel.app`
- [ ] Progress note added in `docs/` with summary + blockers + next 3 actions
