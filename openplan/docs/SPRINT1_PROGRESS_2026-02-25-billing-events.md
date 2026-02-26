# Sprint 1 Progress — Billing Event Trail (2026-02-25)

## Scope
Added billing event persistence + visibility to support operational debugging and handoff clarity.

## Changes shipped

1. **Billing events table**
   - Added migration:
     - `supabase/migrations/20260226000007_billing_events.sql`
   - New table: `billing_events`
     - workspace-scoped event timeline with payload JSON.
   - Added RLS read policy for workspace members.

2. **Event logger utility**
   - Added `src/lib/billing/events.ts`
   - Standardized service-role event write helper.

3. **Checkout + webhook event logging**
   - Updated:
     - `src/app/api/billing/checkout/route.ts`
     - `src/app/api/billing/webhook/route.ts`
   - Writes normalized event entries after state transitions.

4. **Billing UI event timeline**
   - Updated `src/app/(workspace)/billing/page.tsx`
   - Added recent events panel for operator visibility.

## Why this matters
- Gives Iris (and operators) a deterministic event trail for billing state transitions.
- Reduces blind spots during Stripe integration and pilot support.
