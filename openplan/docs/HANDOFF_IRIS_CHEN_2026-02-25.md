# Handoff Brief — Iris Chen (Programming Expert)

Date: 2026-02-25
Project: OpenPlan (`/home/nathaniel/.openclaw/workspace/openplan/openplan`)

## 1) Current shipped baseline

Recent production-shipped commits (master):
- `bf61cde` — design-system baseline alignment
- `9afa0fd` — auth onboarding + source transparency
- `548d71e` — KPI instrumentation + report telemetry
- `bf335e1` — ATP/SS4A report template toggle
- `56475ea` — public pricing page + funnel links
- `f30a2fb` — billing checkout skeleton + subscription enforcement
- `388d040` — billing env vars documented
- `f9c990e` — billing webhook skeleton + plan run limits
- `32ee1d4` — data-fetch resilience + walk/bike accessibility baseline

Production URL alias:
- `https://openplan-zeta.vercel.app`

## 2) Billing architecture now in place

### Data model
- Workspace billing fields exist (migration `20260226000006_workspace_billing_skeleton.sql`):
  - `subscription_plan`
  - `subscription_status`
  - `stripe_customer_id`
  - `stripe_subscription_id`
  - `subscription_current_period_end`
  - `billing_updated_at`

### API endpoints
- `POST/GET /api/billing/checkout`
  - owner/admin only
  - starter/professional initialization
  - payment-link mode (env driven) + mock fallback mode
- `POST /api/billing/webhook`
  - secured with `x-openplan-billing-secret`
  - updates workspace billing state

### Gating
- `POST /api/analysis` now enforces:
  - auth
  - workspace membership
  - active subscription status (`active`, `trialing`, `pilot`)
  - plan monthly run limits (`pilot=150`, `starter=100`, `professional=500`, `enterprise=unlimited`)

## 3) UI status
- `/pricing` public page live.
- `/billing` workspace billing page live.
- `/explore` includes ATP/SS4A report template control.
- `/dashboard` includes KPI cards.

## 4) Immediate priorities (Iris owner)

1. **Stripe-native checkout sessions (replace payment-link skeleton)**
   - Implement server-side Checkout Session creation
   - Persist Stripe metadata + customer/workspace linkage
   - Remove mock-mode dependency in production path

2. **Stripe webhook signature verification + idempotency**
   - Verify Stripe signatures (native event verification)
   - Add replay/idempotency guard storage table and checks
   - Map event types to workspace state transitions

3. **Entitlements hardening**
   - Formalize plan capability matrix (e.g., report exports, workspace count)
   - Add central guard helpers and consistent API error contracts

4. **Operator observability**
   - Add billing event audit trail table
   - Add dashboard billing telemetry card(s): MRR placeholder, plan mix, past_due count

## 5) Environment variables to maintain
- `OPENPLAN_STRIPE_CHECKOUT_URL_STARTER`
- `OPENPLAN_STRIPE_CHECKOUT_URL_PROFESSIONAL`
- `OPENPLAN_BILLING_WEBHOOK_SECRET`
- `OPENPLAN_STRIPE_WEBHOOK_SECRET`
- `OPENPLAN_STRIPE_SECRET_KEY`
- `OPENPLAN_STRIPE_ALLOW_GUARDED_FALLBACK` (default false; only true for controlled migration windows)
- `OPENPLAN_STRIPE_WEBHOOK_SECRET`
- `OPENPLAN_STRIPE_SECRET_KEY`

## 6) Notes / cautions
- Repo has some in-progress non-billing files outside these commits; avoid broad staging.
- Keep commits scoped and deploy after each coherent increment.
- Maintain client-safe language and explicit AI disclosure in outputs.
