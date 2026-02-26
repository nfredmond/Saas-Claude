# Sprint 1 Progress — Billing Webhook + Plan Limits (2026-02-25)

## Scope
Extended billing skeleton to include webhook-driven status updates and first-pass plan entitlement enforcement.

## Changes shipped

1. **Billing webhook endpoint (secured skeleton)**
   - Added `src/app/api/billing/webhook/route.ts`
   - Requires header: `x-openplan-billing-secret`
   - Uses env secret: `OPENPLAN_BILLING_WEBHOOK_SECRET`
   - Updates workspace billing fields:
     - `subscription_status`
     - `subscription_plan`
     - `stripe_customer_id`
     - `stripe_subscription_id`
     - `subscription_current_period_end`

2. **Plan limits utility**
   - Added `src/lib/billing/limits.ts`
   - Includes plan normalization and monthly run caps:
     - pilot: 150
     - starter: 100
     - professional: 500
     - enterprise: unlimited

3. **Analysis entitlement enforcement**
   - Updated `src/app/api/analysis/route.ts` to enforce monthly run limits after subscription-status check.
   - Returns clear `429` when plan limit is reached.

4. **Env docs updated**
   - `.env.example` now includes:
     - `OPENPLAN_BILLING_WEBHOOK_SECRET`

## Notes
- Webhook endpoint is provider-agnostic for now (works with transformed Stripe events).
- Next iteration should add native Stripe signature verification and event replay protection.
