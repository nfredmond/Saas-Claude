# Sprint 1 Progress — Billing Webhook Robustness (2026-02-25)

## Scope
Hardened billing webhook processing with replay/idempotency controls and Stripe-native signature verification scaffolding while preserving existing transformed-webhook compatibility.

## Changes shipped

1. **Webhook idempotency/replay protection**
   - Added migration:
     - `supabase/migrations/20260226000008_billing_webhook_receipts.sql`
   - New table: `billing_webhook_receipts`
     - Unique `(provider, event_id)` replay guard
     - Status lifecycle (`received`, `processed`, `ignored`, `failed`)
     - Payload hash persistence for deterministic diagnostics
   - Added helper:
     - `src/lib/billing/webhook-idempotency.ts`

2. **Stripe signature verification scaffolding (guarded fallback)**
   - Added helper:
     - `src/lib/billing/webhook.ts`
   - Added:
     - Native signature verification function (`verifyStripeWebhookSignature`)
     - Stripe event normalization for:
       - `checkout.session.completed`
       - `customer.subscription.created`
       - `customer.subscription.updated`
       - `customer.subscription.deleted`
   - Deterministic guarded fallback behavior:
     - If Stripe signature exists but native verification is unavailable due missing SDK or missing webhook secret, route can fall back to legacy secret-auth payload path.
     - Invalid Stripe signatures do **not** fallback.

3. **Webhook route hardening**
   - Updated:
     - `src/app/api/billing/webhook/route.ts`
   - Added:
     - Raw-body hashing for deterministic event identity
     - Duplicate replay short-circuit (`200 { duplicate: true }`)
     - Explicit ignored path for unsupported Stripe event types
     - Receipt completion updates (`processed`, `ignored`, `failed`)
     - Extended audit payload with provider event metadata + verification mode

4. **Environment docs updates**
   - Updated `.env.example` with:
     - `OPENPLAN_BILLING_WEBHOOK_SECRET`
     - `OPENPLAN_STRIPE_WEBHOOK_SECRET`
     - `OPENPLAN_STRIPE_SECRET_KEY`

## Required env vars

```bash
# Existing transformed-webhook authorization
OPENPLAN_BILLING_WEBHOOK_SECRET=

# Native Stripe webhook verification
OPENPLAN_STRIPE_WEBHOOK_SECRET=
OPENPLAN_STRIPE_SECRET_KEY=
```

## Local test workflow

1. **Run app locally**
   ```bash
   npm run dev
   ```

2. **Legacy compatibility test (current transformed payload flow)**
   ```bash
   curl -i http://localhost:3000/api/billing/webhook \
     -H "content-type: application/json" \
     -H "x-openplan-billing-secret: $OPENPLAN_BILLING_WEBHOOK_SECRET" \
     -d '{
       "workspaceId":"11111111-1111-4111-8111-111111111111",
       "subscriptionStatus":"active",
       "subscriptionPlan":"starter",
       "eventType":"legacy.test",
       "eventId":"legacy-test-1"
     }'
   ```

3. **Replay guard test (send same event twice)**
   - Re-run the exact same curl command.
   - Second response should contain `duplicate: true` and skip workspace mutation.

4. **Stripe native signature path (once Stripe SDK is installed)**
   ```bash
   # Optional next increment dependency
   npm install stripe

   stripe listen --forward-to localhost:3000/api/billing/webhook
   ```
   - Copy printed signing secret into `OPENPLAN_STRIPE_WEBHOOK_SECRET`.
   - Trigger a sample event:
     ```bash
     stripe trigger checkout.session.completed
     ```
   - Confirm webhook route returns `200` and billing events include `verificationMode: "stripe_signature"`.

## TODO markers / known constraints
- Stripe SDK is currently optional and not yet a hard dependency.
- Native verification scaffold uses dynamic module loading and a guarded fallback path for environments not yet migrated to Stripe SDK.
- Plan mapping from Stripe price metadata should be finalized when Stripe Checkout Session creation lands.
