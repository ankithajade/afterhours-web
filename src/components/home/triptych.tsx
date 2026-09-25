import { RevealGroup, RevealItem } from "@/components/reveal";
import { TextEffect } from "@/components/motion-primitives/text-effect";

const BLOCKS = [
  { accent: "NIGHT", caption: "Sunset to sunset, twenty-four hours straight." },
  { accent: "ROOM", caption: "Every team, same floor, same clock." },
  { accent: "BUILD", caption: "Ship something that actually runs." },
];

/** "One night. One room. One build." — the hero line given its own beat. */
export function Triptych() {
  return (
    <section
      aria-label="One night. One room. One build."
      className="relative mx-auto w-full max-w-[84rem] px-4 py-[calc(var(--section-gap)/2)] sm:px-8"
    >
      <RevealGroup
        className="grid gap-10 sm:gap-8 md:grid-cols-3"
        stagger={0.16}
      >
        {BLOCKS.map((block) => (
          <RevealItem key={block.accent}>
            <div className="border-l border-border pl-5 md:border-l-0 md:border-t md:pl-0 md:pt-6">
              <h3 className="font-display text-[clamp(2rem,6vw,3.4rem)] font-bold uppercase leading-[0.95] tracking-[-0.01em]">
                <TextEffect as="span" per="char" speed={0.03} trigger="inView">
                  {"One "}
                </TextEffect>
                <TextEffect
                  as="span"
                  per="char"
                  speed={0.03}
                  delay={0.18}
                  trigger="inView"
                  className="text-primary"
                >
                  {block.accent}
                </TextEffect>
              </h3>
              <p className="mt-3 font-mono text-sm uppercase leading-relaxed tracking-[0.2em] text-muted-foreground">
                {block.caption}
              </p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
