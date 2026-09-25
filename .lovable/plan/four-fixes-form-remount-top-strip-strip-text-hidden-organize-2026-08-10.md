# Four fixes: form remount, top strip, strip text, hidden organizer login

## 1. Contact form loses focus / resets while typing (root cause confirmed)

I reproduced it: typing "Hello" into the name field leaves only "H", focus jumps to the page body, and the input node is replaced in the DOM. It is not a page reload and not a missing `preventDefault` — the contact form already prevents default submission and has no stray submit buttons.

The real cause is in the shared `Reveal` animation wrapper: it calls `motion.create(...)` inside its render body, so a brand-new component type is produced on every render. React sees a different type and throws away the whole subtree, remounting every input inside it. This affects any form wrapped in `Reveal`, including the registration form — not just Contact.

Fix: create the animated element types once (cached at module scope by tag name) instead of per render, so the subtree stays mounted across re-renders.

Verification: type a full sentence into each contact field and tab between them, confirming focus is kept, text is preserved, no navigation occurs, and the same DOM node persists. Repeat the check on the registration form.

## 2. Narrower sticky top strip

Tighten the fixed header caption bar: cap its width and reduce horizontal padding so it reads as a compact centred bar rather than a full-bleed band. Reduce the strip's height/backdrop panel accordingly so the fixed header block stays visually light, and keep the hero spacer in sync so nothing overlaps.

## 3. Strip text

Replace the caption text with "Don Bosco Institute of Technology". The department line moves out of the fixed strip; the hero keeps its existing "AWS Student Builder Group, DBIT" line above the eyebrow, and the department credit stays available in the footer/hero copy so the information isn't lost.

## 4. Hide the organizer login link

Remove the "Organizer login" link from the footer. `/auth` keeps working exactly as-is with no new gate — it just isn't advertised anywhere in public UI.

## Technical notes

- `src/components/reveal.tsx` — hoist `motion.create` out of render (module-level cache keyed by element type).
- `src/components/site-chrome.tsx` — strip width/padding/height, new caption text, remove the `/auth` `Link`.
- Layout re-checked at 1440 / 1024 / 754 / 390 px after the header height change.
