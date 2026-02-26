# Sprint 1 Progress — Public Pricing Page (2026-02-25)

## Scope
Advanced the pilot conversion funnel with a public pricing page and nav/home integration.

## Changes shipped

1. **New public route**
   - Added `src/app/(public)/pricing/page.tsx`
   - Includes Starter + Professional pilot plans, feature bullets, and onboarding CTA.

2. **Navigation integration**
   - Updated `src/components/top-nav.tsx` to include `Pricing` for signed-in and signed-out users.

3. **Homepage funnel integration**
   - Updated `src/app/page.tsx` with "View Pilot Pricing" quick-link card.

## Notes
- Stripe checkout remains in-progress; page currently positions plans and routes to sign-up.
- Pricing language is transparent and avoids black-box claims.
