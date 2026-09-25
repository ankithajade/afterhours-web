# AfterHours 1.0 — CMS, light theme, motion stack

Ten scoped fixes. The two big ones are the admin CMS and the light-mode default.

## 1. "1.0" accent scoped to the hero only

Keep the small ember "1.0" tag only in the hero headline next to the large "AFTERHOURS". Nav wordmark, footer wordmark and any other "AfterHours 1.0" text render as plain text at their normal size.

## 2. "BEYOND" in accent colour

Subhead renders as CODE / BEYOND / THE CLOCK with only the middle word in the ember accent token.

## 3. Admin CMS (biggest item)

New `site_content` table (key, value, type: text | number | url | image, group, updated_at) plus a `site_assets` storage bucket for logos and sponsor images.

Seed it in the migration with every string currently hardcoded in `src/lib/event-data.ts`: hero eyebrow/headline/subhead/tagline/blurb, organizer line, event details (dates, venue, team size, fee, prize pool), countdown start/end, about copy, timeline entries, FAQ entries, sponsor contact, social links, coordinator contacts.

- Public read: `TO anon` select policy so pages can read content during SSR.
- Writes: organizers only, via `is_organizer(auth.uid())`.
- Public pages load content through a route loader + TanStack Query, with the current `event-data.ts` values kept as fallback defaults so nothing goes blank if a key is missing.
- Admin dashboard gains tabs at the existing `/dashboard` route: **Registrations** (unchanged), **Content** (grouped forms — hero, event details, about, FAQ list, socials, sponsors, with add/remove rows for FAQ and timeline), **Assets** (upload/replace DBIT crest, AWS SBG logo, sponsor logos; shows current image and a replace button).
- Saving invalidates the query so the public site reflects edits immediately.

## 4. Light theme as default

Flip the bootstrap default to light (dark still available via the existing toggle and still honoured if the visitor already chose it). Then audit and adjust the light palette across hero, about, timeline, details, prizes, FAQ, sponsors, registration, status, auth, dashboard and footer: card surfaces, borders, muted text contrast, ember accent on light backgrounds, and the background layer's opacity so text stays legible.

## 5. Logos move into the hero organizer lockup

The DBIT + AWS SBG logo slots move out of the stats area and sit directly with the organizer line inside the hero. They render from the CMS-managed asset URLs, with the current dashed placeholder shown until real files are uploaded.

## 6. AWS SBG logo in the navbar

Small right-aligned logo in the header, sized so it sits quietly next to the theme toggle and Register CTA; hidden on the narrowest widths so it never crowds the mobile menu button.

## 7. Countdown target 9:30 AM IST

Start becomes 30 Oct 2026 09:30 IST, end 31 Oct 2026 09:30 IST. Countdown-up during the live day and all "starts 00:00 IST" copy update to match. These become CMS-editable values too.

## 8. Motion stack swap

Install `motion` and add the motion-primitives `text-effect` component. Replace the current CSS-keyframe reveal/hover approach:

- scroll reveals → motion `whileInView`
- hover/tap → motion `whileHover` / `whileTap`
- countdown digits → motion flip/roll
- hero headline + subhead entrance → `text-effect` type-in
`cn()` already exists in `src/lib/utils.ts` (clsx + tailwind-merge installed); it gets used consistently across the touched components. `prefers-reduced-motion` continues to be respected.

## 9 & 10. New background, old grid removed

Delete the broken `.ah-grid` implementation and its keyframes entirely. Replace with a reactbits-style animated background component (subtle aurora/grid drift) rendered once as the sitewide layer, driven by theme tokens so it works in both light and dark at low opacity.  
Reference **[https://reactbits.dev/backgrounds](https://reactbits.dev/backgrounds)** for background treatment. Pick one of their animated background components (something along the lines of a subtle grid/particle/aurora background, low opacity, dark-mode-and-light-mode-aware since we're now defaulting to light) and implement it as the sitewide background layer, replacing the current flat/broken grid. It should read as atmospheric, not busy — text and cards must stay fully legible over it.

## Technical notes

- Content table read via a public server function during SSR (publishable client, narrow anon select), mutations via authenticated server functions guarded by `is_organizer`.
- Image uploads go to a public storage bucket; only organizers can write.
- Reactbits components are copy-paste source, so the background lands as a local component rather than a dependency.

## Needs your input (not guessing)

- Real DBIT and AWS SBG logo files — I'll ship upload slots in the admin Assets tab; placeholders stay until you upload.
- Real Instagram / LinkedIn / WhatsApp / email handles and the sponsor contact inbox — editable in the admin Socials group, placeholders until then.