import { useEffect, useRef, useState } from "react";
import { eventInstants, useContent } from "@/lib/content";
import { usePrefersReducedMotion } from "@/components/reveal";
import { useIntroPlay } from "@/lib/intro";

type Phase = "before" | "live" | "after";

export type CountdownState = {
  phase: Phase;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  progress: number;
};

/** Anchor for the ring sweep: 120 days out from the start instant. */
const ANCHOR_OFFSET_MS = 120 * 24 * 60 * 60 * 1000;

export function computeCountdown(nowMs: number, startMs: number, endMs: number): CountdownState {
  const ANCHOR_MS = startMs - ANCHOR_OFFSET_MS;
  let phase: Phase = "before";
  let deltaMs: number;
  let progress: number;

  if (nowMs < startMs) {
    phase = "before";
    deltaMs = startMs - nowMs;
    progress = clamp01((nowMs - ANCHOR_MS) / (startMs - ANCHOR_MS));
  } else if (nowMs < endMs) {
    phase = "live";
    deltaMs = nowMs - startMs;
    progress = clamp01(deltaMs / (endMs - startMs));
  } else {
    phase = "after";
    deltaMs = nowMs - endMs;
    progress = 1;
  }

  const total = Math.floor(deltaMs / 1000);
  return {
    phase,
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    progress,
  };
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function pad(n: number, len = 2) {
  return String(Math.max(0, n)).padStart(len, "0");
}

/** One split-flap digit: the new glyph rolls down over the old one on change. */
function FlapDigit({ value, reduced }: { value: string; reduced: boolean }) {
  const [current, setCurrent] = useState(value);
  const [previous, setPrevious] = useState<string | null>(null);

  useEffect(() => {
    setCurrent((old) => {
      if (old === value) return old;
      setPrevious(old);
      return value;
    });
  }, [value]);

  useEffect(() => {
    if (previous === null) return;
    const t = setTimeout(() => setPrevious(null), 340);
    return () => clearTimeout(t);
  }, [previous, current]);

  return (
    <span className="relative inline-block h-[1.15em] w-[1ch] overflow-hidden align-middle tabular-nums">
      {previous !== null && !reduced && (
        <span
          aria-hidden="true"
          className="ah-flap-out absolute inset-0 flex items-center justify-center"
        >
          {previous}
        </span>
      )}
      <span
        key={current}
        className={`absolute inset-0 flex items-center justify-center ${reduced ? "" : "ah-flap"}`}
      >
        {current}
      </span>
    </span>
  );
}

function Segment({
  value,
  label,
  digits = 2,
  reduced,
  live,
}: {
  value: number;
  label: string;
  digits?: number;
  reduced: boolean;
  live: boolean;
}) {
  const text = pad(value, digits);
  return (
    <div className="flex min-w-0 flex-col items-center">
      <span
        className={`font-mono text-[clamp(1rem,12.5cqw,2.15rem)] font-semibold leading-none tracking-tight ${live ? "text-live" : "text-foreground"}`}
      >
        {text.split("").map((d, i) => (
          <FlapDigit key={`${label}-${i}`} value={d} reduced={reduced} />
        ))}
      </span>
      <span className="mt-2 font-mono text-[clamp(0.42rem,2.6cqw,0.58rem)] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function CountdownRing() {
  const reduced = usePrefersReducedMotion();
  const intro = useIntroPlay();
  const content = useContent();
  const { startMs, endMs } = eventInstants(content);
  const [state, setState] = useState<CountdownState | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => setState(computeCountdown(Date.now(), startMs, endMs));
    tick();
    const id = setInterval(tick, 1000);
    return () => {
      clearInterval(id);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [startMs, endMs]);

  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const progress = state?.progress ?? 0;
  const offset = circumference * (1 - progress);
  const live = state?.phase === "live";

  return (
    <div className="@container relative mx-auto flex w-full max-w-[min(22rem,72vw)] items-center justify-center">
      {/* Glow bloom behind the ring */}
      <div
        aria-hidden="true"
        className={`animate-breathe pointer-events-none absolute inset-[12%] rounded-full blur-3xl ${live ? "bg-live/25" : "bg-primary/25"}`}
      />

      <svg
        viewBox="0 0 100 100"
        className="relative w-full -rotate-90"
        role="img"
        aria-label={
          state
            ? live
              ? `Hackathon in progress. Elapsed ${state.days} days ${state.hours} hours ${state.minutes} minutes.`
              : `Countdown to AFTERHOURS 1.0: ${state.days} days ${state.hours} hours ${state.minutes} minutes remaining.`
            : "Loading countdown"
        }
      >
        <defs>
          <linearGradient id="ah-ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor={live ? "var(--color-live)" : "var(--color-primary)"} />
          </linearGradient>
        </defs>

        <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--ring-track)" strokeWidth="1.6" />
        {/* tick marks */}
        <g opacity="0.28">
          {Array.from({ length: 60 }).map((_, i) => {
            const angle = (i / 60) * Math.PI * 2;
            const inner = i % 5 === 0 ? 39.5 : 41.5;
            // Rounded so server and client markup match exactly.
            const round = (n: number) => Number(n.toFixed(3));
            return (
              <line
                key={i}
                x1={round(50 + Math.cos(angle) * inner)}
                y1={round(50 + Math.sin(angle) * inner)}
                x2={round(50 + Math.cos(angle) * 43)}
                y2={round(50 + Math.sin(angle) * 43)}
                stroke="var(--ring-track)"
                strokeWidth={i % 5 === 0 ? 0.8 : 0.4}
                strokeLinecap="round"
              />
            );
          })}

        </g>

        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="url(#ah-ring-grad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={state ? offset : circumference}
          style={{
            transition:
              reduced || !intro ? "none" : "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)",
            filter: "drop-shadow(0 0 3px var(--color-primary))",
          }}
        />
        {state && !reduced && (
          <circle
            cx={50 + Math.cos(progress * Math.PI * 2) * radius}
            cy={50 + Math.sin(progress * Math.PI * 2) * radius}
            r="1.8"
            fill={live ? "var(--color-live)" : "var(--color-primary)"}
          />
        )}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-[12%] text-center">
        <span
          className={`font-mono text-[clamp(0.45rem,2.8cqw,0.6rem)] uppercase tracking-[0.26em] whitespace-nowrap ${live ? "text-live" : "text-muted-foreground"}`}
        >
          {state === null
            ? "Syncing IST…"
            : live
              ? "◉ Hacking live"
              : state.phase === "after"
                ? "Since wrap-up"
                : content.event.startTimeLabel}
        </span>

        <div
          className="mt-[3%] flex items-start justify-center gap-x-[2.5cqw]"

          aria-live="off"
        >
          {state === null ? (
            <div className="h-12 w-40 animate-pulse rounded bg-muted" />
          ) : (
            <>
              <Segment value={state.days} label="Days" reduced={reduced} live={live} />
              <Segment value={state.hours} label="Hrs" reduced={reduced} live={live} />
              <Segment value={state.minutes} label="Min" reduced={reduced} live={live} />
              <Segment value={state.seconds} label="Sec" reduced={reduced} live={live} />
            </>
          )}
        </div>

        <span className="mt-[3%] font-mono text-[clamp(0.4rem,2.4cqw,0.55rem)] uppercase leading-tight tracking-[0.16em] whitespace-nowrap text-muted-foreground">
          {content.event.datesLabel} · IST
        </span>
      </div>
    </div>
  );
}
