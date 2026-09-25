import type { SVGProps } from "react";

/**
 * Thin-stroke clock face used as the site mark and as the typographic
 * substitute for the "O" in HOURS.
 */
export function ClockGlyph({
  className,
  strokeWidth = 1.5,
  ...rest
}: SVGProps<SVGSVGElement> & { strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      <circle cx="12" cy="12" r="9.25" />
      <path d="M12 6.75V12l3.6 2.15" />
    </svg>
  );
}
