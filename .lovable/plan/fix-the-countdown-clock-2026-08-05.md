# Fix the countdown clock

The big countdown ring in the hero is rendering badly: the digits overlap each other (the seconds pair reads as one smeared glyph), the number block sits off-centre and low inside the ring, the date caption wraps onto two lines, and on narrow screens the ring blows up to ~480px so the tick marks and glow crowd everything around them.

## What's wrong

- Each flip digit is a fixed-width box narrower than the glyph it holds, and the glyph is absolutely positioned inside it. At larger font sizes the character spills past its box and collides with the next digit.
- The four segments sit in a tight 4-column grid with almost no gap, so days/hrs/min/sec run together.
- The inner text block is centred on the whole SVG box rather than allowing for the ring's stroke and caption, pushing the caption into the ring edge and wrapping it.
- The ring's max width is tied to viewport width with no upper bound relative to the surrounding column, so it dominates the hero on small and mid screens.

## The fix

- Rebuild the flip digit so each digit reserves the real width of a monospace character (fixed `ch`-based width, no overflow), keeping the same roll-down flip animation and reduced-motion behaviour.
- Give the four segments proper breathing room: consistent column gaps, a separator-free but clearly grouped layout, and digit/label sizes that scale down cleanly on small screens.
- Re-centre the inner content: tighter vertical rhythm between the status line, digits, and date caption, with the caption forced to one line at all sizes.
- Cap the ring size so it stays comfortably inside its column (smaller on mobile, moderate on desktop) and keep the headline the dominant element.
- Soften the tick-mark ring slightly so it reads as a dial rather than noise behind the numbers.

No changes to countdown logic, dates, or any other section — this is presentation only, all inside `src/components/countdown-ring.tsx` (plus a small hero column tweak if the ring still crowds the grid).

## Verification

Screenshot the hero at mobile and desktop widths after the change and confirm no digit overlap, no caption wrap, and a centred, legible clock.
