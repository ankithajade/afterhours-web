# AFTERHOURS 1.0 — Event Site + Registration Platform

A designed marketing site plus a real registration backend: teams saved to a database, ₹1,000 payment via Lovable's built-in Stripe, confirmation email, and a password-protected organizer dashboard.

## Design direction

Dual-theme, both first-class, with a header toggle that remembers the choice and follows the system setting on first visit.

- Dark: void navy `#0A0E14` base, translucent panels, ember orange `#FF6B35` primary, electric cyan `#00D9FF` for live/active states only, off-white text, slate captions.
- Light: warm off-white surface, same ember/cyan accents at high contrast, ink-dark text — not a washed-out inversion.
- All values live as design tokens in the stylesheet; no per-component hardcoded colors.
- Type: Space Grotesk (headlines), JetBrains Mono (countdown, dates, labels), Inter (body).
- Signature: full-size glowing radial countdown ring in the hero, monospace DD:HH:MM:SS, locked to IST (30 Oct 2026, 00:00 IST) for every visitor, flipping to elapsed-time mode during the 30–31 Oct window.
- Motion: staged load reveal (terminal headline wipe → ring draws in → CTAs spring last), split-flap digit rolls on tick, scroll-drift reveals, subtle parallax grid, magnetic button glow, pulsing timeline nodes. Transform/opacity only, with a fades-only variant under `prefers-reduced-motion`.
- Dividers as scanline/circuit traces; timeline as a real connected-node path. No numbered badges on non-sequential content.

## Pages

**Home (`/`)** — Hero → About → Timeline (18 Oct / 25 Oct / 30–31 Oct) → Event Details grid → Registration → Prize Pool → FAQ accordion → Leadership & Blessings → Sponsors (placeholder tiles + "Become a Sponsor") → Footer.

Leadership names, titles, dates, venue, fee, and prize total used exactly as given. Coordinator phones ship as visible `+91 XXXXXXXXXX` placeholders. Open items render as explicit "To be confirmed" states, never invented: prize split by rank, mixed-college eligibility, refund policy, food/accommodation, team-size flexibility.

**`/register/status`** — return with a reference ID to retry an abandoned payment.

**`/admin`** — organizer dashboard behind sign-in.

**`/auth`** — organizer sign-in.

## Registration flow

1. Team lead enters team name and their own details (name, email, contact, college, USN), then 2–4 member rows (name, email, contact, college).
2. Inline validation: required fields, email format, 10-digit Indian phone, member count 2–4.
3. Submit saves the team as `pending` and returns a reference ID immediately — details survive an abandoned payment.
4. Redirect to Stripe Checkout for ₹1,000.
5. Stripe's server-side webhook flips `payment_status` to paid and `registration_status` to confirmed. The client redirect only shows a status page; it never confirms.
6. Confirmation email with team name, reference ID, and next steps.
7. Pending teams retry payment from the status page using their reference ID.

Payments use Lovable's built-in Stripe: no Stripe account or API keys needed from you, with a test mode to trial the full flow before going live.

## Admin dashboard

Email + password organizer accounts (I create them; you'll set up the first). Table of all teams, members expandable per row, filters on payment and registration status, CSV export, and manual override to mark a team confirmed or waitlisted for offline payments.

## Technical section

- Backend: Supabase via Lovable Cloud (Postgres database, auth, server functions) — no separate Supabase account or setup needed.
- Tables: `teams` (team_name, college_name, reference_id, payment_status, registration_status, created_at) and `team_members` (team_id, name, email, phone, college_id_number, role). Roles in a separate `user_roles` table read through a security-definer `has_role()` function — never on a profile row. Explicit GRANTs per table.
- Registration runs through a `createServerFn` that re-validates with Zod and relies on database enforcement too: unique constraint on member email (global), and a count check keeping teams at 2–4 members. Each violation maps to a specific message the form surfaces inline, so calling the API directly can't bypass the rules.
- RLS: anonymous callers can create a registration but can never read team data; only admin-role accounts read, update, or delete. `/admin` sits under a server-side auth gate plus an admin-role check, not just an unlinked URL.
- Stripe webhook at a public API route under `/api/public/`, verifying the signature before any write; idempotent on the checkout session ID.
- Confirmation email through Lovable's managed email using a React Email template — requires a sender domain you own before real sends.
- Every async action has loading, empty, and error states. Full keyboard navigation, visible focus rings, real `<label>`s, responsive from 320px, with dedicated small-screen layouts for the countdown ring and timeline path.
- Per-route SEO metadata and social preview tags.

## Build order

1. Enable Lovable Cloud; migrations for tables, roles, RLS, grants, constraints.
2. Design tokens, fonts, theme toggle, motion primitives.
3. Home page sections with countdown ring and animations.
4. Registration form + server function + status/retry page.
5. Enable Stripe, product for the ₹1,000 fee, checkout server function, webhook route.
6. Auth, admin gate, dashboard with filters, expandable members, CSV export, manual overrides.
7. Email domain setup and confirmation email template.

## Needed from you later

Real coordinator phone numbers, prize split by rank, eligibility/food/refund answers, sponsor logos, and a sender domain you own. All drop into marked placeholders without restructuring.
