import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Reveal } from "@/components/reveal";
import { ClockGlyph } from "@/components/clock-glyph";

const description = "Problem statements for the AFTERHOURS 1.0 Pre-Qualification round drop here on 18 October 2026.";

export const Route = createFileRoute("/problem-statements")({
  head: () => ({
    meta: [
      { title: "Problem Statements — AFTERHOURS 1.0" },
      { name: "description", content: description },
      { property: "og:title", content: "Problem Statements — AFTERHOURS 1.0" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Problem Statements — AFTERHOURS 1.0" },
      { name: "twitter:description", content: description },
    ],
  }),
  component: ProblemStatementsPage,
});

function ProblemStatementsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto flex min-h-[80vh] w-full max-w-4xl flex-col px-5 pb-24 pt-12 sm:px-6 sm:pt-16">
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

        <div className="flex flex-1 flex-col items-center justify-center text-center mt-12">
          <Reveal>
            <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-2xl border border-border bg-surface/50 p-6">
              <span
                aria-hidden="true"
                className="ah-node-ping absolute inset-0 rounded-2xl bg-primary/20"
              />
              <ClockGlyph className="h-full w-full text-primary" strokeWidth={1.5} />
            </div>
          </Reveal>
          
          <Reveal delay={100}>
            <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold uppercase leading-[1.05] tracking-[-0.02em]">
              Problem Statements
            </h1>
            <p className="ah-prose mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Problem statements drop here on <strong className="text-foreground">18 October</strong>, when the Pre-Qualification round opens.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-10">
              <a
                href={`${import.meta.env.BASE_URL}#timeline`}
                className="ah-magnetic inline-flex items-center justify-center rounded-md bg-secondary px-6 py-3.5 font-mono text-sm font-semibold uppercase tracking-[0.16em] text-secondary-foreground transition-colors hover:bg-secondary/80"
              >
                View the Timeline
              </a>
            </div>
          </Reveal>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
