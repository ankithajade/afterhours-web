import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { CountdownRing } from "@/components/countdown-ring";
import { ClockGlyph } from "@/components/clock-glyph";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import collegeLogoBlack from "@/assets/college-logo-black.svg.asset.json";
import collegeLogoWhite from "@/assets/college-logo-white.svg.asset.json";
import awsSbgSquareWhite from "@/assets/aws-sbg-square-white.svg.asset.json";
import awsSbgSquareGrey from "@/assets/aws-sbg-square-grey.svg.asset.json";
import { useContent } from "@/lib/content";
import { REGISTER_URL } from "@/lib/event-data";
import { useIntroPlay } from "@/lib/intro";

/** Organizer logo: renders the CMS-uploaded image, or a labelled slot until one is added. */
export function OrganizerLogo({
  src,
  label,
  className,
}: {
  src: string;
  label: string;
  className?: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={label}
        loading="lazy"
        className={`h-9 w-auto max-w-[7rem] object-contain ${className ?? ""}`}
      />
    );
  }
  return (
    <div
      className={`flex h-9 w-[5.5rem] shrink-0 items-center justify-center rounded-md border border-dashed border-border bg-surface/50 text-center ${className ?? ""}`}
    >
      <span className="font-mono text-[0.7rem] uppercase leading-tight tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

/** Renders the subhead with the accent word coloured. */
function Subhead({ text, accent }: { text: string; accent: string }) {
  if (!accent || !text.toUpperCase().includes(accent.toUpperCase())) return <>{text}</>;
  const index = text.toUpperCase().indexOf(accent.toUpperCase());
  return (
    <>
      {text.slice(0, index)}
      <span className="text-primary">{text.slice(index, index + accent.length)}</span>
      {text.slice(index + accent.length)}
    </>
  );
}

/** Renders text with the first "O" swapped for a clock face glyph. */
function WithClockO({ text }: { text: string }) {
  const i = text.toUpperCase().indexOf("O");
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <ClockGlyph className="ah-clock-o" strokeWidth={1.6} />
      {text.slice(i + 1)}
    </>
  );
}

export function Hero() {
  const content = useContent();
  const intro = useIntroPlay();
  const s = intro ? 1 : 0;
  const { hero } = content;
  const [head, ...tailParts] = [hero.title.slice(0, 5), hero.title.slice(5)];
  const tail = tailParts.join("");

  return (
    <section className="relative overflow-hidden pt-6 pb-[var(--section-gap)] sm:pt-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-primary/12 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background"
      />

      <div className="relative mx-auto mt-2 grid w-full max-w-[84rem] items-center gap-12 px-4 sm:px-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-10">
        {/* College logo — top-right corner of the hero area, theme-aware. */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 * s, delay: 0.1 * s, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute top-0 right-0 z-10 hidden lg:block"
        >
          <img
            src={collegeLogoBlack.url}
            alt="Don Bosco Institute of Technology"
            loading="eager"
            className="h-[4.83rem] w-auto max-w-[17.55rem] object-contain dark:hidden"
          />
          <img
            src={collegeLogoWhite.url}
            alt="Don Bosco Institute of Technology"
            loading="eager"
            className="hidden h-[4.83rem] w-auto max-w-[17.55rem] object-contain dark:block"
          />
        </motion.div>
        <div className="@container">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 * s, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3"
          >
            <img
              src={awsSbgSquareWhite.url}
              alt="AWS Student Builder Group"
              loading="eager"
              className="hidden h-8 w-8 shrink-0 object-contain dark:block"
            />
            <img
              src={awsSbgSquareGrey.url}
              alt="AWS Student Builder Group"
              loading="eager"
              className="h-8 w-8 shrink-0 object-contain dark:hidden"
            />
            <p className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-black dark:text-white sm:text-base">
              AWS Student Builder Group, DBIT
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 * s, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground backdrop-blur sm:text-xs"
          >
            <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
              <span className="ah-node-ping absolute inset-0 rounded-full bg-primary" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8 * s, delay: 0.08 * s, ease: [0.16, 1, 0.3, 1] }}
            className="ah-headline mt-4 font-display font-bold uppercase leading-[0.82] tracking-[-0.05em]"
          >
            <span className="ah-headline-line">
              <span className="ah-headline-word">
                {head}
                <span className="text-gradient-ember">
                  <WithClockO text={tail} />
                </span>
              </span>
              <span className="ah-headline-tag text-primary">{hero.version}</span>
            </span>
          </motion.h1>

          <h2 className="mt-4 font-display text-[clamp(1.1rem,3.4vw,2rem)] font-bold uppercase tracking-[0.14em]">
            <Subhead text={hero.subhead} accent={hero.subheadAccentWord} />
          </h2>

          <TextEffect
            per="word"
            speed={intro ? 0.03 : 0}
            delay={0.15 * s}
            className="mt-2 font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground sm:text-sm"
          >
            {hero.tagline}
          </TextEffect>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 * s, delay: 0.24 * s, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground"
          >
            {hero.blurb}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 * s, delay: 0.3 * s, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              to={REGISTER_URL}
              className="ah-magnetic inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3.5 font-mono text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground"
            >
              Register your team
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <a
              href="#details"
              className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3.5 font-mono text-sm font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:bg-surface"
            >
              Event details
            </a>
          </motion.div>

          <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-4">
            {[
              { k: "Fee", v: "₹1,000", s: "per team" },
              { k: "Team", v: "2 – 4", s: "lead included" },
              { k: "Runtime", v: "24 h", s: "non-stop" },
              { k: "Dates", v: "30 – 31 Oct", s: "2026 · starts 09:30 IST" },
            ].map((item, i) => (
              <motion.div
                key={item.k}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6 * s,
                  delay: (0.36 + i * 0.07) * s,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <dt className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {item.k}
                </dt>
                <dd className="mt-1.5 whitespace-nowrap font-display text-xl font-bold leading-tight">{item.v}</dd>
                <dd className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {item.s}
                </dd>
              </motion.div>
            ))}
          </dl>

        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 * s, delay: 0.22 * s, ease: [0.16, 1, 0.3, 1] }}
        >
          <CountdownRing />
        </motion.div>
      </div>
    </section>
  );
}
