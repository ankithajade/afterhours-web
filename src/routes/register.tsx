import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { UNSTOP_URL } from "@/lib/event-data";

const description =
  "Everything to know before registering for AFTERHOURS 1.0 — the ₹1,000 team fee, the pre-qualification round, the refund policy and WhatsApp updates.";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Before You Register — AFTERHOURS 1.0" },
      { name: "description", content: description },
      { property: "og:title", content: "Before You Register — AFTERHOURS 1.0" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://afterhours-chronos.lovable.app/register" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Before You Register — AFTERHOURS 1.0" },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "https://afterhours-chronos.lovable.app/register" }],
  }),
  component: RegisterPage,
});

const NOTES = [
  "Registration fee: ₹1,000 per team.",
  "There's a Pre-Qualification Round before the main event.",
  "The main event is a 24-hour offline hackathon.",
  "Only qualified teams from the pre-qualification round advance to the main event.",
  "If a team doesn't qualify for the main round, ₹750 of the ₹1,000 fee will be refunded. The remaining ₹250 covers the pre-qualification round's processing, evaluation and coordination costs already incurred by the organizing team regardless of outcome — judging the submissions, platform costs and administrative overhead — which are non-refundable once the round has run.",
  "All event updates will be shared over WhatsApp.",
  "A WhatsApp community invitation will be sent via email after registering.",
];

function RegisterPage() {
  const [acknowledged, setAcknowledged] = useState(false);
  return (

    <>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-3xl px-5 pb-24 pt-12 sm:px-6 sm:pt-16">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft
            aria-hidden="true"
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1"
          />
          Back to home
        </Link>

        <Reveal className="mt-8">
          <header className="text-center">
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-primary">
              Read this first
            </p>
            <h1 className="mt-3 font-display text-[clamp(2rem,5.5vw,3.25rem)] font-bold uppercase leading-[1.05] tracking-[-0.02em]">
              Before you register
            </h1>
            <p className="ah-prose mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              A few things worth knowing about the fee, the rounds and how updates reach you.
            </p>
          </header>
        </Reveal>

        <RevealGroup className="mt-10 space-y-3" stagger={0.07}>
          {NOTES.map((note) => (
            <RevealItem key={note}>
              <div className="panel ah-lift flex items-start gap-4 rounded-xl p-5">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"
                >
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <p className="ah-prose text-base leading-relaxed text-muted-foreground">{note}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={120} className="mt-12">
          <div className="panel glow-primary rounded-2xl p-8 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Ready when you are
            </p>

            <label className="mx-auto mt-6 flex max-w-md cursor-pointer items-start justify-center gap-3 text-left text-base text-muted-foreground">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[var(--color-primary)]"
              />
              <span>I have read and understood the information above.</span>
            </label>

            {acknowledged ? (
              <a
                href={UNSTOP_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="ah-magnetic mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-8 py-4 font-mono text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground sm:w-auto"
              >
                Register on Unstop
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </a>
            ) : (
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="mt-5 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-md border border-border bg-surface/60 px-8 py-4 font-mono text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground opacity-60 sm:w-auto"
              >
                Register on Unstop
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </button>
            )}
          </div>
        </Reveal>

      </main>
      <SiteFooter />
    </>
  );
}
