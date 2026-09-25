const ITEMS = [
  "HEXAVERSE CLOUDFEST '26",
  "AWS STUDENT BUILDER GROUP, DBIT",
  "DEPARTMENT OF CSE",
  "AFTERHOURS 1.0",
];

/** Slow branding ticker between major sections. Pauses on hover. */
export function BrandMarquee() {
  const strip = (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <span
          key={item}
          className="flex items-center gap-6 whitespace-nowrap px-6 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground"
        >
          {item}
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-primary" />
        </span>
      ))}
    </div>
  );

  return (
    <div
      aria-hidden="true"
      className="ah-marquee border-y border-border/70 bg-surface/30 py-3.5 backdrop-blur-sm"
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
