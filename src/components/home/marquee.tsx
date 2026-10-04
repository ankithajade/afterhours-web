import awsMobileBlack from "@/assets/aws-mobile-black.svg";
import awsMobileWhite from "@/assets/aws-mobile-white(2).svg";
import unstopBlue from "@/assets/unstop-blue.svg";
import unstopWhite from "@/assets/unstop-white.svg";
import tridhaBlack from "@/assets/tridha-black.svg";
import tridhaWhite from "@/assets/tridha-white.svg";

const ITEMS = [
  {
    label: "Organized by",
    lightSrc: awsMobileBlack,
    darkSrc: awsMobileWhite,
    alt: "AWS Student Builder Group, DBIT",
    logoHeight: "2.6rem",
  },
  {
    label: "Powered by",
    lightSrc: unstopBlue,
    darkSrc: unstopWhite,
    alt: "Unstop",
    logoHeight: "2.3rem",
  },
  {
    label: "Co-powered by",
    lightSrc: tridhaBlack,
    darkSrc: tridhaWhite,
    alt: "Tridha",
    logoHeight: "3.2rem",
  },
];

/** Slow branding ticker between major sections. Pauses on hover. */
export function BrandMarquee() {
  const strip = (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <span
          key={item.label}
          className="inline-flex shrink-0 items-center gap-3 whitespace-nowrap px-8"
        >
          <span className="font-mono text-sm uppercase tracking-[0.22em] text-muted-foreground">
            {item.label}
          </span>
          {/* Fixed-height logo slot — strip height is always driven by this, not the logo itself */}
          <span className="flex h-10 items-center">
            <img
              src={item.lightSrc}
              alt={item.alt}
              style={{ height: item.logoHeight }}
              className="w-auto object-contain dark:hidden"
              aria-hidden="true"
            />
            <img
              src={item.darkSrc}
              alt={item.alt}
              style={{ height: item.logoHeight }}
              className="hidden w-auto object-contain dark:block"
              aria-hidden="true"
            />
          </span>
          <span aria-hidden="true" className="ml-5 h-1 w-1 rounded-full bg-primary" />
        </span>
      ))}
    </div>
  );

  return (
    <div
      aria-hidden="true"
      className="ah-marquee overflow-hidden border-y border-border/70 bg-surface/30 py-4 backdrop-blur-sm"
    >
      <div className="ah-marquee__track">
        {strip}
        {strip}
        {strip}
        {strip}
      </div>
    </div>
  );
}
