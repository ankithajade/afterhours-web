import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronDown,
  Download,
  ExternalLink,
  FileDown,
  Target,
  AlertCircle,
  FileText,
  Cpu,
  Layers,
  CheckCircle2,
} from "lucide-react";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import {
  PROBLEM_STATEMENTS,
  type ProblemStatement,
  UNSTOP_URL,
} from "@/lib/event-data";

const description =
  "Official Round 1 Pre-Qualification problem statements for AFTERHOURS 1.0 DBIT Hackathon — hosted by AWS Student Builder Group (AWS SBG DBIT) at Don Bosco Institute of Technology.";

const PAGE_URL = "https://awsevents.dbit.edu.in/afterhours-1.0/problem-statements";
const OG_IMAGE = "https://awsevents.dbit.edu.in/afterhours-1.0/og-afterhours.png";

export const Route = createFileRoute("/problem-statements")({
  head: () => ({
    meta: [
      { title: "Problem Statements — DBIT Hackathon | AWS SBG AFTERHOURS 1.0" },
      { name: "description", content: description },
      { property: "og:title", content: "Problem Statements — DBIT Hackathon | AWS SBG AFTERHOURS 1.0" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Problem Statements — DBIT Hackathon | AWS SBG AFTERHOURS 1.0" },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
  }),
  component: ProblemStatementsPage,
});

function ProblemStatementItem({
  item,
  isOpen,
  onToggle,
}: {
  item: ProblemStatement;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelId = `ps-panel-${item.id}`;
  const headerId = `ps-header-${item.id}`;

  return (
    <div className="panel ah-lift overflow-hidden rounded-xl border border-border/80 transition-all duration-300 hover:border-primary/40">
      <h2 id={headerId}>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="group flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors duration-200 hover:bg-surface/60 sm:px-6 sm:py-6"
        >
          <div className="space-y-1.5 pr-2">
            <div className="flex items-baseline gap-2.5">
              <span className="font-mono text-xs font-semibold text-primary/80 sm:text-sm">
                {item.number}.
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-foreground sm:text-xl md:text-2xl">
                {item.title}
              </span>
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary sm:text-xs">
              {item.domain}
            </p>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-surface/50 text-muted-foreground transition-all duration-300 group-hover:border-primary/40 group-hover:text-primary">
            <ChevronDown
              aria-hidden="true"
              className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
                isOpen ? "rotate-180 text-primary" : ""
              }`}
            />
          </div>
        </button>
      </h2>

      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className="ah-collapse"
        data-open={isOpen ? "true" : "false"}
      >
        <div>
          <div className="space-y-6 border-t border-border/70 bg-surface/20 px-5 pb-7 pt-6 sm:px-7 sm:pb-8 sm:pt-7">
            {/* Problem Statement */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                <FileText className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Problem Statement
              </div>
              <p className="ah-prose text-base leading-relaxed text-foreground/90 sm:text-lg">
                {item.statement}
              </p>
            </div>

            {/* Challenge */}
            <div className="rounded-xl border border-primary/25 bg-primary/[0.04] p-4.5 sm:p-5">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                <Target className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                Challenge
              </div>
              <p className="mt-2.5 text-base leading-relaxed text-foreground">
                {item.challenge}
              </p>
            </div>

            {/* What makes it challenging */}
            <div className="rounded-xl border border-border/80 bg-background/50 p-4.5 sm:p-5">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-amber-400/90">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                What Makes It Challenging
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {item.challengingAspect}
              </p>
            </div>

            {/* Core Techniques (if provided) */}
            {item.coreTechniques && item.coreTechniques.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  <Cpu className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  Core Techniques
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.coreTechniques.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-surface/80 px-3 py-1 font-mono text-xs text-foreground/80 shadow-xs"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProblemStatementsPage() {
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set([PROBLEM_STATEMENTS[0].id]),
  );

  const toggleStatement = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const allExpanded = openIds.size === PROBLEM_STATEMENTS.length;

  const toggleAll = () => {
    if (allExpanded) {
      setOpenIds(new Set());
    } else {
      setOpenIds(new Set(PROBLEM_STATEMENTS.map((s) => s.id)));
    }
  };

  return (
    <>
      <SiteHeader />
      <main
        id="main"
        className="mx-auto flex min-h-[80vh] w-full max-w-4xl flex-col px-5 pb-24 pt-12 sm:px-6 sm:pt-16"
      >
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

        {/* Header section */}
        <header className="mt-8 mb-10 sm:mb-12">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
              Round 1 — Pre-Qualification
            </div>
            <h1 className="mt-4 font-display text-[clamp(2.25rem,6vw,4rem)] font-bold uppercase leading-[0.98] tracking-[-0.02em]">
              Problem Statements
            </h1>
            <p className="ah-prose mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Choose one of the 6 problem statements below for your Round 1 submission. Teams must submit a solution presentation covering problem understanding, technical approach, feasibility, and impact on Unstop.
            </p>
          </Reveal>

          {/* Quick info badges / action bar */}
          <Reveal delay={100}>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-border/80 py-4">
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-muted-foreground font-mono">
                <div>
                  <span className="text-foreground font-semibold uppercase tracking-wider">Window: </span>
                  21 Oct – 25 Oct 2026, 05:00 PM IST
                </div>
                <div>
                  <span className="text-foreground font-semibold uppercase tracking-wider">Team Size: </span>
                  2 – 4 Members
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`${import.meta.env.BASE_URL}AfterHours_1.0_Pre-Qualification_Round_Problem_Statements.pdf`}
                  download="AfterHours_1.0_Pre-Qualification_Round_Problem_Statements.pdf"
                  className="inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.14em] text-primary transition-colors hover:bg-primary/20"
                >
                  <FileDown className="h-3.5 w-3.5" aria-hidden="true" />
                  Download PDF
                </a>
                <a
                  href={`${import.meta.env.BASE_URL}AfterHours%201.0%20PPT%20Template.pptx`}
                  download="AfterHours 1.0 PPT Template.pptx"
                  className="inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.14em] text-primary transition-colors hover:bg-primary/20"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  Download PPT
                </a>
                <button
                  type="button"
                  onClick={toggleAll}
                  className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline cursor-pointer ml-1"
                >
                  {allExpanded ? "Collapse All" : "Expand All"}
                </button>
              </div>
            </div>
          </Reveal>
        </header>

        {/* Problem Statements Accordion List */}
        <section aria-label="Problem statements list">
          <RevealGroup className="space-y-4 sm:space-y-5">
            {PROBLEM_STATEMENTS.map((statement, idx) => (
              <RevealItem key={statement.id} delay={idx * 50}>
                <ProblemStatementItem
                  item={statement}
                  isOpen={openIds.has(statement.id)}
                  onToggle={() => toggleStatement(statement.id)}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        {/* Submission & Next Steps Banner */}
        <Reveal delay={250}>
          <div className="mt-12 panel rounded-2xl border border-primary/30 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.24em] text-primary">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  Submission Guidelines
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  Ready with your proposed solution?
                </h3>
                <p className="ah-prose text-sm leading-relaxed text-muted-foreground max-w-xl">
                  Prepare your slide deck addressing the selected problem statement, architecture, implementation roadmap, and impact. Submit before 25 October 2026, 5:00 PM IST.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  to="/rules"
                  className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:bg-surface/80"
                >
                  <Layers className="mr-2 h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                  View Rules
                </Link>
                <a
                  href={UNSTOP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ah-magnetic inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground shadow-md transition-all hover:bg-primary/90"
                >
                  Submit on Unstop
                  <ExternalLink className="ml-2 h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </main>
      <SiteFooter />
    </>
  );
}
