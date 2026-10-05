import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Bus, Car, Check, Copy, MapPin, Navigation, Train } from "lucide-react";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";

const description =
  "Venue location, map embed, address and transit options (Cab, Bus, Metro) for AFTERHOURS 1.0 hackathon at Don Bosco Institute of Technology, Kumbalagodu, Bengaluru.";

const PAGE_URL = "https://awsevents.dbit.edu.in/afterhours-1.0/venue";
const OG_IMAGE = "https://awsevents.dbit.edu.in/afterhours-1.0/og-afterhours.png";
const MAPS_DIR_URL = "https://maps.app.goo.gl/8byKXP1EANUoiWSFA";
const FULL_ADDRESS = "Don Bosco Institute of Technology, Kumbalagodu, Mysuru Road, Bengaluru – 560074, Karnataka.";

export const Route = createFileRoute("/venue")({
  head: () => ({
    meta: [
      { title: "Venue & Directions — AFTERHOURS 1.0 | DBIT Bengaluru" },
      { name: "description", content: description },
      { property: "og:title", content: "Venue & Directions — AFTERHOURS 1.0" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Venue & Directions — AFTERHOURS 1.0" },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
  }),
  component: VenuePage,
});

const KEY_TIMES = [
  { label: "Date", value: "30 – 31 October 2026", hint: "24-Hour Offline Finale" },
  { label: "Check-in", value: "07:30 AM IST", hint: "Registration & badge pickup" },
  { label: "Program Starts", value: "09:30 AM IST", hint: "Opening ceremony & keynotes" },
];

const TRANSIT_OPTIONS = [
  {
    icon: Car,
    title: "Cab / Auto",
    description:
      "The simplest option for most people — the campus is directly on Mysuru Road. Share the address with your driver, or send them the Google Maps link.",
    badge: "Direct Access",
  },
  {
    icon: Bus,
    title: "Bus (BMTC)",
    description:
      "The nearest bus stop is Kumbalagodu, directly outside the campus along Mysuru Road. Commonly reported BMTC routes include 212M, 226-N, 226VB, 227-NA, and 374-M. (Note: Please verify live routes via the official BMTC app or Google Maps prior to travel).",
    badge: "Campus Gate Stop",
  },
  {
    icon: Train,
    title: "Metro (Purple Line)",
    description:
      "Nearest station is Challaghatta on the Purple Line, located approximately 3 km (~10+ min auto or cab ride) from the campus. It is not walking distance.",
    badge: "Challaghatta Station",
  },
];

function VenuePage() {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    void navigator.clipboard.writeText(FULL_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-5xl px-5 pb-24 pt-12 sm:px-6 sm:pt-16 lg:px-8">
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

        {/* Section 1: Heading */}
        <Reveal className="mt-8">
          <header className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-primary">
              Location &amp; Directions
            </p>
            <h1 className="mt-3 font-display text-[clamp(2rem,5.5vw,3.25rem)] font-bold uppercase leading-[1.05] tracking-[-0.02em]">
              Don Bosco Institute of Technology, Bengaluru
            </h1>
            <p className="ah-prose mt-4 text-lg leading-relaxed text-muted-foreground">
              Everything you need to find your way to the 24-hour offline finale venue.
            </p>
          </header>
        </Reveal>

        {/* Section 2: Key Info Row */}
        <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-3" stagger={0.08}>
          {KEY_TIMES.map((item) => (
            <RevealItem key={item.label}>
              <div className="panel ah-lift rounded-xl p-5">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-2 font-display text-xl font-bold leading-snug text-foreground">
                  {item.value}
                </p>
                <p className="mt-1 font-mono text-xs text-primary">{item.hint}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Section 3: Large Map Embed */}
        <Reveal className="mt-12">
          <div className="panel glow-primary overflow-hidden rounded-2xl p-3 sm:p-4">
            <div className="relative h-80 w-full overflow-hidden rounded-xl border border-border bg-surface sm:h-[26rem]">
              <iframe
                src="https://maps.google.com/maps?q=12.8821969,77.4448703&z=15&output=embed"
                title="Don Bosco Institute of Technology Map"
                loading="lazy"
                className="h-full w-full border-0"
              />
            </div>
            <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row sm:px-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <span>Kumbalagodu, Mysuru Road, Bengaluru</span>
              </div>
              <a
                href={MAPS_DIR_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="ah-magnetic inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground sm:w-auto"
              >
                Get Directions
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </div>
        </Reveal>

        {/* Section 4: Address & Copy Button */}
        <Reveal className="mt-10">
          <div className="panel rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  Full Campus Address
                </p>
                <p className="mt-2 text-lg font-semibold leading-relaxed text-foreground sm:text-xl">
                  {FULL_ADDRESS}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyAddress}
                className="ah-magnetic inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-border bg-surface/80 px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Address
                  </>
                )}
              </button>
            </div>
          </div>
        </Reveal>

        {/* Section 5: How to get here */}
        <div className="mt-16">
          <Reveal>
            <div className="text-center sm:text-left">
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-primary">
                Transit Guide
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold uppercase sm:text-3xl">
                How to get here
              </h2>
            </div>
          </Reveal>

          <RevealGroup className="mt-8 grid gap-6 md:grid-cols-3" stagger={0.1}>
            {TRANSIT_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <RevealItem key={option.title} className="h-full">
                  <div className="panel ah-lift flex h-full flex-col rounded-xl p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full border border-border bg-surface/50 px-2.5 py-0.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
                        {option.badge}
                      </span>
                    </div>

                    <h3 className="mt-5 font-display text-lg font-bold text-foreground">
                      {option.title}
                    </h3>
                    <p className="ah-prose mt-2.5 text-sm leading-relaxed text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
