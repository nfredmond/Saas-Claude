# Sprint 1 Progress — Report Template Toggle (2026-02-25)

## Scope
Implemented the first ATP vs SS4A narrative framing toggle for exported reports.

## Changes shipped

1. **Report API template support**
   - Updated `src/app/api/report/route.ts` request schema with:
     - `template: "atp" | "ss4a"` (default `atp`)
   - HTML and PDF outputs now receive the template mode.
   - Report subtitle now includes selected program lens.

2. **Template-aware report content**
   - Added program lens metadata helper in report route.
   - Added a dedicated **Funding Program Lens** section in exported HTML.
   - AI interpretation heading now reflects selected template context.

3. **Explore UI template controls**
   - Updated `src/app/(public)/explore/page.tsx` with ATP/SS4A toggle.
   - HTML/PDF export requests now send selected template.
   - Export button labels now reflect active template.

## Notes
- This is a framing layer, not a fully distinct methodology engine yet.
- Next iteration can apply stronger template-specific section ordering, language presets, and compliance references.
