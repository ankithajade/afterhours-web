/**
 * Sitewide backdrop — the "signal field": a dark radar/oscilloscope-inspired
 * surface built from five fixed layers behind all page content.
 *
 *  1. base surface (dark navy / warm off-white in light mode)
 *  2. fine 28px dot-grid, barely perceptible technical texture
 *  3. three static concentric rings echoing the countdown ring, centred
 *     off-canvas at 90% / 110% of the viewport so only the upper-left arcs show
 *  4. two slow-drifting, heavily blurred glow blooms (ember + signal cyan)
 *  5. fractal-noise grain overlay
 */
export function SiteBackdrop() {
  return (
    <div aria-hidden="true" className="ah-field">
      <span className="ah-field__dots" />

      <svg
        className="ah-field__rings"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        focusable="false"
      >
        <circle className="ah-ring ah-ring--1" cx="90" cy="110" r="78" vectorEffect="non-scaling-stroke" />
        <circle className="ah-ring ah-ring--2" cx="90" cy="110" r="56" vectorEffect="non-scaling-stroke" />
        <circle className="ah-ring ah-ring--3" cx="90" cy="110" r="34" vectorEffect="non-scaling-stroke" />
      </svg>

      <span className="ah-field__bloom ah-field__bloom--ember" />
      <span className="ah-field__bloom ah-field__bloom--signal" />

      <svg className="ah-field__grain" focusable="false">
        <filter id="ah-grain-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#ah-grain-filter)" />
      </svg>
    </div>
  );
}
