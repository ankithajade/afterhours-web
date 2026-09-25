import { useEffect, useRef, useState } from "react";

import { ChevronDown } from "lucide-react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { SectionShell, TbcBadge } from "@/components/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { useContent } from "@/lib/content";
import type { FaqItem } from "@/lib/event-data";

/** Counts a numeric figure up from zero when it scrolls into view. */
export function CountUp({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, value]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export function About() {
  const { about } = useContent();
  return (
    <SectionShell
      id="about"
      eyebrow="What it is"
      title={
        <>
          Twenty-four hours, one room, and a build that has to{" "}
          <span className="text-primary">actually run</span>.
        </>
      }
      lede={about.lede}
    >
      {/* One shared trigger on the grid — children animate in DOM order. */}
      <RevealGroup className="grid gap-4 sm:grid-cols-3" stagger={0.11}>
        {about.cards.map((card, i) => (
          <RevealItem key={card.title} className="h-full">
            <article className="panel ah-lift h-full rounded-xl p-6">
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-xl font-bold">{card.title}</h3>
              <p className="ah-prose mt-2 text-base leading-relaxed text-muted-foreground">
                {card.body}
              </p>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </SectionShell>
  );
}

/** Drops the bracketed qualifier from a timeline title. */
function shortTitle(title: string) {
  return (title.split("(")[0] ?? title).trim();
}

/**

 * Live "where things stand" rail. Derives the active phase from the timeline's
 * own dates rather than a hardcoded value.
 */
function StageRail({ items }: { items: ReturnType<typeof useContent>["timeline"] }) {
  const { event } = useContent();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const stops = items.map((i) => Date.parse(`${i.dateISO}T00:00:00+05:30`));
  const endMs = Date.parse(event.endsAt);

  let index = -1;
  let headline = "Checking…";
  let secondary = "";
  let status: "before" | "active" | "done" = "before";

  if (now !== null) {
    for (let i = 0; i < stops.length; i += 1) {
      const stop = stops[i];
      if (stop !== undefined && !Number.isNaN(stop) && now >= stop) index = i;
    }
    if (index < 0) {
      const first = items[0];
      headline = "Not started yet";
      secondary = first ? `Opens ${first.date}` : "";
      status = "before";
    } else if (!Number.isNaN(endMs) && now > endMs) {
      index = stops.length - 1;
      headline = "Completed";
      secondary = "AfterHours 1.0 has wrapped";
      status = "done";
    } else {
      headline = shortTitle(items[index]?.title ?? "");
      const next = items[index + 1];
      secondary = next ? `Next: ${shortTitle(next.title)} · ${next.date}` : "Final stage in progress";
      status = "active";
    }
  }

  // Ring fill: 0 before the first stop, then one slice per completed stage.
  const fraction =
    now === null ? 0 : status === "done" ? 1 : index < 0 ? 0 : (index + 1) / stops.length;

  const R = 52;
  const C = 2 * Math.PI * R;

  return (
    <div className="panel relative h-full rounded-2xl p-6 sm:p-7">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
        Live status
      </p>

      <div className="mt-6 flex flex-col items-center gap-6 text-center">
        <div className="relative h-32 w-32 shrink-0">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              strokeWidth="6"
              className="stroke-border"
            />
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              className="stroke-primary transition-[stroke-dashoffset] duration-1000 ease-out"
              style={{
                strokeDasharray: C,
                strokeDashoffset: C * (1 - fraction),
                filter: "drop-shadow(0 0 6px rgba(255,107,53,0.55))",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-2xl font-bold tabular-nums leading-none">
              {Math.round(fraction * 100)}%
            </span>
            <span className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
              {status === "done" ? "done" : `stage ${Math.max(index + 1, 0)}/${stops.length}`}
            </span>
          </div>
          {status === "active" ? (
            <span
              aria-hidden="true"
              className="ah-node-ping absolute inset-6 rounded-full bg-primary/20"
            />
          ) : null}
        </div>

        <div aria-live="polite" className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
            {status === "active" ? "Currently" : status === "done" ? "Status" : "Up next"}
          </p>
          <p className="mt-2 font-display text-xl font-bold leading-tight sm:text-2xl">
            {headline}
          </p>
          {secondary ? (
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">{secondary}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function Timeline() {
  const { timeline } = useContent();
  return (
    <SectionShell
      id="timeline"
      eyebrow="Key dates"
      title="Timeline"
      lede="Three dates that matter — an online pre-qualification round, the qualified-team announcement, and the 24-hour offline finale."
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-start">
        <RevealGroup
          as="ol"
          stagger={0.13}
          className="relative ml-3 space-y-8 border-l border-border pl-8 sm:ml-4"
        >
          {timeline.map((item) => (
            <RevealItem as="li" key={item.title} className="group relative">
              <span
                aria-hidden="true"
                className={`absolute -left-[2.3125rem] top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ring-background transition-all duration-300 group-hover:scale-150 ${
                  item.kind === "event"
                    ? "bg-live group-hover:shadow-[var(--glow-live)]"
                    : "bg-primary group-hover:shadow-[var(--glow-primary)]"
                }`}
              >
                <span
                  className={`ah-node-ping absolute inset-0 rounded-full ${item.kind === "event" ? "bg-live" : "bg-primary"}`}
                />
              </span>

              <time
                dateTime={item.dateISO}
                className={`font-mono text-xs uppercase tracking-[0.24em] ${item.kind === "event" ? "text-live" : "text-primary"}`}
              >
                {item.date}
              </time>
              <h3 className="mt-2 text-xl font-bold">{item.title}</h3>
              <p className="ah-prose mt-1.5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={140} className="lg:sticky lg:top-24">
          <StageRail items={timeline} />
        </Reveal>
      </div>
    </SectionShell>
  );
}

export function EventDetails() {
  const { details } = useContent();
  const lastTwoStart = Math.max(details.length - 2, 0);
  return (
    <SectionShell
      id="details"
      eyebrow="The specifics"
      title="Event details"
      lede="Everything confirmed about the format, the venue, the money and the overnight logistics, in one place."
    >
      <RevealGroup className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6" stagger={0.07}>
        {details.map((item, i) => (
          <RevealItem
            key={item.label}
            className={`h-full ${i >= lastTwoStart ? "lg:col-span-3" : "lg:col-span-2"}`}
          >
            <div className="panel ah-lift h-full rounded-xl p-5">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {item.label}
              </p>
              <p className="mt-2 font-display text-lg font-bold leading-snug">{item.value}</p>
              {item.tbc ? <TbcBadge className="mt-3" /> : null}
              {item.hint ? (
                <p className="ah-prose mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.hint}
                </p>
              ) : null}
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </SectionShell>
  );
}


export function PrizePool() {
  const { event } = useContent();
  const raw = event.prizePool ?? "";
  const digits = Number(raw.replace(/[^\d]/g, "")) || 0;
  const prefix = raw.startsWith("₹") ? "₹" : "";
  const suffix = raw.trim().endsWith("+") ? "+" : "";

  return (
    <SectionShell id="prizes" eyebrow="Rewards" title="Prize pool" align="center">
      <Reveal>
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="panel glow-primary relative mx-auto max-w-2xl overflow-hidden rounded-2xl p-8 text-center sm:p-10"
        >
          <p className="relative font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Total prize pool
          </p>
          <p className="text-gradient-ember relative mt-4 font-display text-[clamp(2.5rem,11vw,6rem)] font-bold leading-none tabular-nums">
            {digits > 0 ? <CountUp value={digits} prefix={prefix} suffix={suffix} /> : raw}
          </p>
          <p className="relative mx-auto mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            Awarded across the winning teams of the 24-hour finale.
          </p>
        </motion.div>
      </Reveal>
    </SectionShell>
  );
}

function FaqRow({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(false);
  const id = `faq-panel-${index}`;
  return (
    <div className="panel ah-lift overflow-hidden rounded-xl">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
        >
          <span className="text-base font-semibold leading-snug sm:text-lg">{item.q}</span>
          <ChevronDown
            aria-hidden="true"
            className={`h-4 w-4 shrink-0 text-primary transition-transform duration-300 ease-in-out ${open ? "rotate-180" : ""}`}
          />
        </button>
      </h3>
      <div id={id} role="region" className="ah-collapse" data-open={open ? "true" : "false"}>
        <div>
          <div className="border-t border-border px-5 pb-6 pt-4 text-base leading-relaxed text-muted-foreground sm:px-6">
            <p className="ah-prose">{item.a}</p>
            {item.tbc ? <TbcBadge className="mt-3" /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Faq() {
  const { faq } = useContent();
  return (
    <SectionShell
      id="faq"
      eyebrow="Questions"
      title="FAQ"
      lede="Only questions with real answers, grounded in the confirmed event details."
    >
      <RevealGroup className="grid items-start gap-4 lg:grid-cols-2" stagger={0.06}>
        {faq.map((item, i) => (
          <RevealItem key={item.q}>
            <FaqRow item={item} index={i} />
          </RevealItem>
        ))}
      </RevealGroup>
    </SectionShell>
  );
}

export function Sponsors() {
  const { sponsors } = useContent();
  return (
    <SectionShell
      id="sponsors"
      eyebrow="Partners"
      title="Sponsor AFTERHOURS 1.0"
      lede="Sponsor slots for AFTERHOURS 1.0 are open — brand presence on campus, in front of teams from across colleges, for a full 24 hours."
      align="center"
    >
      <Reveal>
        <div className="panel mx-auto max-w-xl rounded-2xl p-6 text-center sm:p-8">
          <p className="text-base leading-relaxed text-muted-foreground">{sponsors.body}</p>
          {sponsors.contactEmail ? (
            <a
              href={`mailto:${sponsors.contactEmail}`}
              className="ah-magnetic mt-6 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3.5 font-mono text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground"
            >
              {sponsors.contactEmail}
            </a>
          ) : null}
        </div>
      </Reveal>
    </SectionShell>
  );
}
