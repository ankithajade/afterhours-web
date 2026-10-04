import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";

const description =
  "Official rules and regulations for AFTERHOURS 1.0 — Pre-Qualification round details, Grand Finale format, evaluation criteria, and key rules.";

export const Route = createFileRoute("/rules")({
  head: () => ({
    meta: [
      { title: "Rules & Regulations — AFTERHOURS 1.0" },
      { name: "description", content: description },
      { property: "og:title", content: "Rules & Regulations — AFTERHOURS 1.0" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Rules & Regulations — AFTERHOURS 1.0" },
      { name: "twitter:description", content: description },
    ],
  }),
  component: RulesPage,
});

const ROUND_1_REQUIREMENTS = [
  "Team size: 2–4 members. No solo participation.",
  "Choose one problem statement provided by the organizers.",
  "Submit a solution presentation covering the problem, solution, innovation, technical approach, implementation, and impact — submitted on Unstop.",
  "Include complete team and team leader details.",
];

const ROUND_1_CRITERIA = [
  "Problem understanding",
  "Innovation & creativity",
  "Technical feasibility",
  "Impact & scalability",
  "Presentation clarity",
];

const ROUND_2_REQUIREMENTS = [
  "Team size: 2–4 members.",
  "Choose one theme provided by the organizers.",
  "Build and demonstrate a working prototype.",
  "Bring your own laptops, chargers, and any required hardware.",
];

const ROUND_2_CRITERIA = [
  "Innovation",
  "Technical implementation",
  "Working prototype",
  "Impact & scalability",
  "Presentation",
];

const KEY_RULES = [
  "Teams must follow all announced deadlines and submission requirements.",
  "The final project must comply with hackathon guidelines and represent the team's own original work.",
  "Plagiarism, unauthorized copying, fraudulent submissions, impersonation, and interference with another team's work are prohibited.",
  "Rule violations may result in penalties or disqualification.",
  "The decision of the judging panel and Organizing Committee is final.",
];

function Round1Content() {
  return (
    <div className="space-y-6">
      <Reveal>
        <section>
          <h2 className="font-display text-2xl font-bold leading-tight sm:text-3xl">
            Round 1 — Pre-Qualification
          </h2>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.24em] text-primary">
            20 Oct 2026, 12:00 AM IST – 23 Oct 2026, 11:59 PM IST
          </p>
          <p className="ah-prose mt-4 text-base leading-relaxed text-muted-foreground">
            The first screening stage. Teams get multiple problem statements and choose one to develop and submit a proposed solution for.
          </p>
        </section>
      </Reveal>
      <Reveal>
        <div className="panel rounded-xl p-6">
          <h3 className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Requirements
          </h3>
          <ul className="mt-4 space-y-2.5">
            {ROUND_1_REQUIREMENTS.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span className="text-base leading-relaxed text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
      <Reveal>
        <div className="panel rounded-xl p-6">
          <h3 className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Evaluated on
          </h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {ROUND_1_CRITERIA.map((c) => (
              <span key={c} className="inline-flex items-center rounded-full border border-border bg-surface/50 px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-foreground">
                {c}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
      <Reveal>
        <div className="panel rounded-xl p-6">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Results
          </p>
          <p className="ah-prose mt-2 text-base leading-relaxed text-muted-foreground">
            Shortlisted teams are announced on <strong className="text-foreground">27 October</strong>. Teams that qualify move straight into the Grand Finale, where they'll pick a theme and build a working prototype from scratch.
          </p>
        </div>
      </Reveal>
    </div>
  );
}

function Round2Content() {
  return (
    <div className="space-y-6">
      <Reveal>
        <section>
          <h2 className="font-display text-2xl font-bold leading-tight sm:text-3xl">
            Round 2 — AfterHours 1.0: Final Offline Hackathon
          </h2>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.24em] text-primary">
            30 Oct 2026, 09:30 AM IST – 31 Oct 2026, 12:00 PM IST
          </p>
          <p className="ah-prose mt-4 text-base leading-relaxed text-muted-foreground">
            Shortlisted teams build a functional prototype addressing a problem within one theme chosen from those provided by the organizers.
          </p>
        </section>
      </Reveal>
      <Reveal>
        <div className="panel rounded-xl p-6">
          <h3 className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Requirements
          </h3>
          <ul className="mt-4 space-y-2.5">
            {ROUND_2_REQUIREMENTS.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span className="text-base leading-relaxed text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
      <Reveal>
        <div className="panel glow-primary rounded-xl p-6">
          <p className="text-base font-semibold leading-relaxed text-foreground">
            ⚠ Important
          </p>
          <p className="ah-prose mt-2 text-base leading-relaxed text-muted-foreground">
            The problem statement submitted during Pre-Qualification <strong className="text-foreground">cannot be reused</strong> in the Finale. Teams found reusing it will be disqualified.
          </p>
        </div>
      </Reveal>
      <Reveal>
        <div className="panel rounded-xl p-6">
          <h3 className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Evaluated on
          </h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {ROUND_2_CRITERIA.map((c) => (
              <span key={c} className="inline-flex items-center rounded-full border border-border bg-surface/50 px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-foreground">
                {c}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
      <Reveal>
        <div className="panel rounded-xl p-6">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Results
          </p>
          <p className="ah-prose mt-2 text-base leading-relaxed text-muted-foreground">
            The jury's decision is final.
          </p>
        </div>
      </Reveal>
    </div>
  );
}

function RulesPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-7xl px-5 pb-24 pt-12 sm:px-6 sm:pt-16 lg:px-8 xl:px-12">
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
          <header className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-primary">
              Know the format
            </p>
            <h1 className="mt-3 font-display text-[clamp(2rem,5.5vw,3.25rem)] font-bold uppercase leading-[1.05] tracking-[-0.02em]">
              Rules &amp; Regulations
            </h1>
            <p className="ah-prose mt-4 text-lg leading-relaxed text-muted-foreground">
              Two rounds, two different asks. Read both before you register.
            </p>
          </header>
        </Reveal>

        {/* ── Rounds Desktop (Two Columns) ── */}
        <div className="mt-14 hidden md:grid md:grid-cols-2 md:gap-8 lg:gap-12">
          <div className="rounded-2xl border border-border bg-surface/30 p-6 md:p-8">
            <Round1Content />
          </div>
          <div className="rounded-2xl border border-border bg-surface/30 p-6 md:p-8">
            <Round2Content />
          </div>
        </div>

        {/* ── Rounds Mobile (Tabs) ── */}
        <div className="mt-12 block md:hidden">
          <Tabs.Root defaultValue="round1">
            <Reveal>
              <Tabs.List className="flex w-full gap-2 rounded-lg bg-surface/50 p-1">
                <Tabs.Trigger
                  value="round1"
                  className="flex-1 rounded-md py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-all hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                >
                  Round 1
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="round2"
                  className="flex-1 rounded-md py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-all hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                >
                  Round 2
                </Tabs.Trigger>
              </Tabs.List>
            </Reveal>

            <div className="mt-8 rounded-2xl border border-border bg-surface/30 p-6">
              <Tabs.Content value="round1" className="focus:outline-none">
                <Round1Content />
              </Tabs.Content>
              
              <Tabs.Content value="round2" className="focus:outline-none">
                <Round2Content />
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </div>

        <div className="mx-auto mt-16 max-w-3xl">
          {/* ── Key Rules ── */}
          <Reveal>
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold leading-tight sm:text-3xl">
                Key Rules
              </h2>
            </div>
          </Reveal>
          <RevealGroup className="mt-6 space-y-3" stagger={0.07}>
            {KEY_RULES.map((rule) => (
              <RevealItem key={rule}>
                <div className="panel ah-lift flex items-start gap-4 rounded-xl p-5">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                  />
                  <p className="ah-prose text-base leading-relaxed text-muted-foreground">{rule}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          {/* ── Note ── */}
          <Reveal className="mt-12">
            <div className="rounded-xl border border-dashed border-border bg-surface/40 p-6">
              <p className="ah-prose text-sm leading-relaxed text-muted-foreground">
                This page summarizes the official rules from the AfterHours 1.0 Unstop listing. Please also make sure you've joined the official WhatsApp communication channel after registering, so you don't miss updates or deadline reminders.
              </p>
            </div>
          </Reveal>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
