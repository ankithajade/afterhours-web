# AFTERHOURS 1.0 — Revision Pass

All 13 items applied as separate, scoped fixes. Nothing outside this list gets restyled.

## Hero

- Headline scaled up to be the dominant element on the page (larger than the countdown ring): heavier weight, tighter tracking, `clamp()` topping out well above the current size. "AFTERHOURS" on one line, "1.0" set as a version tag beside it — smaller scale, ember accent colour, raised baseline. Space Grotesk kept.
- Content restored above/below the headline:
  - Eyebrow: "HEXAVERSE CLOUDFEST '26 PRESENTS"
  - Subhead: "CODE BEYOND THE CLOCK"
  - Tagline: "Inter-College 24-Hour Technical Hackathon"
  - Organizer lockup near the bottom of the hero: two bounded placeholder logo containers (DBIT crest + AWS Student Builder Group) side by side, correctly sized for real files, plus the line "Organized by Department of Computer Science & Engineering, in association with AWS Student Builder Group, DBIT".
- Hero CTA "Register your team" navigates to `/register` instead of scrolling.

**Needed from you:** the DBIT crest and the AWS Student Builder Group logo files. Until then the lockup shows labelled placeholder frames, not blank space.

## Navbar

- Glowing dot replaced with a thin-stroke clock outline icon (lucide `Clock`), small and inline with the wordmark.

## Team size (2–4 total, lead included)

Corrected everywhere so the lead counts as one of the 2–4:

- Event Details grid and any copy referencing "1 lead + 2 to 4".
- FAQ answers mentioning team size.
- Registration form: member count selector 2–4, lead occupies row 1.
- Validation: Zod schema becomes a single `members` array of 2–4 rows with exactly one flagged as lead — no `+1` anywhere.
- Database: migration updating `register_team` so the count check is `2 <= total <= 4` including the lead row, and the matching error message.

## About

- Copy rewritten in a concrete voice — 24 hours, offline, at DBIT, teams shipping something real against the clock. No stock hackathon phrasing.
- Card 1 kept. Cards 2 and 3 replaced with two angles not covered elsewhere on the page: what separates AfterHours from a typical hackathon, and what "code beyond the clock" actually asks of participants.

## Timeline

Same connected-node visual, exactly these three entries:

1. 18th October — Pre-Qualification Round Begins (Online)
2. 25th October — Qualified Teams Announced
3. 30th–31st October — AfterHours 1.0 (24-Hour Hackathon — Offline)

## Registration moved to `/register`

- New route at `src/routes/register/index.tsx`, sharing the site's dark grid/glow treatment — not a bare form page. Removed from the homepage; hero and nav CTAs point at it.
- Two-step flow:
  - Step 1: choose team size (2–4, including the lead).
  - Step 2: generate exactly that many member rows (name, email, phone, college, college ID), first row marked as team lead.
- Backend call, payment flow, reference ID and confirmation screen behaviour unchanged.

## Prize pool

Single prominent figure: "₹35,000+". Rank/category breakdown removed.

## FAQ

- Cut vague and placeholder questions (rank-wise split, "can we register with fewer/more members", anything without a real answer). Keep only questions grounded in established event details, with team-size answers corrected.
- Accordion animation reworked to a smooth ease-in-out height/opacity transition with no jump or flash, and spacing/alignment tightened.

## Leadership section

Deleted entirely from the page and its data removed from `event-data.ts`.

## Sponsors

Placeholder tiles removed. Replaced with a short line inviting sponsors to get in touch plus a "Contact Us" button linking to the footer contact/mailto.

## Social links

Instagram, LinkedIn, WhatsApp and Email icons added to the footer (small repeat in the header if it fits cleanly), all pointing at `#` placeholders.

**Needed from you:** the real Instagram, LinkedIn, WhatsApp and email links before launch — I won't invent handles.

## Atmosphere and motion

- Sitewide animated background layer behind all content: slow-drifting grid plus faint circuit-trace motion at low opacity, fixed behind the page rather than per-section.
- Scroll-triggered reveals (fade + slight upward drift, staggered) applied to every section that's missing them, using the existing `Reveal` component.
- Hover motion: cards lift and gain a soft ember glow, buttons get a magnetic pulse, timeline nodes pulse when scrolled into view.
- All motion is transform/opacity only, no layout shift, and `prefers-reduced-motion` continues to disable it.

## Technical notes

- Files touched: `src/lib/event-data.ts`, `src/components/home/hero.tsx`, `src/components/home/sections.tsx`, `src/components/site-chrome.tsx`, `src/components/section.tsx`, `src/components/registration-form.tsx`, `src/lib/registration-schema.ts`, `src/lib/registration.functions.ts`, `src/routes/index.tsx`, new `src/routes/register/index.tsx`, `src/styles.css`.
- One database migration to relax/correct the member-count rule in `register_team`; no schema shape change, existing rows unaffected.
- `/register` gets its own `head()` metadata (title, description, og tags); the homepage keeps its existing metadata minus the registration anchor.
