import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { Triptych } from "@/components/home/triptych";
import { BrandMarquee } from "@/components/home/marquee";
import {
  About,
  EventDetails,
  Faq,
  PrizePool,
  Sponsors,
  Timeline,
} from "@/components/home/sections";
import { Reveal } from "@/components/reveal";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { EVENT, REGISTER_URL } from "@/lib/event-data";

const description =
  "AFTERHOURS 1.0 is a 24-hour inter-college hackathon on 30–31 October 2026. Register your team of 2–4 on Unstop for ₹1,000, and check the timeline, prizes and FAQ.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AFTERHOURS 1.0 — 24-Hour Hackathon | Register Your Team" },
      { name: "description", content: description },
      { property: "og:title", content: "AFTERHOURS 1.0 — 24-Hour Hackathon" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://afterhours-chronos.lovable.app/" },
      { property: "og:image", content: "https://afterhours-chronos.lovable.app/og-afterhours.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "AFTERHOURS 1.0 — 24-hour inter-college hackathon, 30–31 October 2026" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AFTERHOURS 1.0 — 24-Hour Hackathon" },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: "https://afterhours-chronos.lovable.app/og-afterhours.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://afterhours-chronos.lovable.app/" }],
  }),
  component: Home,
});

function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: EVENT.name,
    description: EVENT.blurb,
    startDate: "2026-10-30T00:00:00+05:30",
    endDate: "2026-10-31T00:00:00+05:30",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    offers: {
      "@type": "Offer",
      price: EVENT.feeInr,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main id="main">
        <Hero />

        <BrandMarquee />

        <About />
        <Timeline />
        <EventDetails />
        <Triptych />

        <section id="register" className="mx-auto w-full max-w-[84rem] scroll-mt-24 px-4 py-[calc(var(--section-gap)/2)] sm:px-8">
          <Reveal>
            <div className="panel glow-primary mx-auto max-w-3xl rounded-2xl p-10 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-primary">
                Lock your slot
              </p>
              <h2 className="mt-3 font-display text-[clamp(2rem,5vw,3.1rem)] font-bold leading-[1.1]">
                Register your team
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                {EVENT.teamSize}. One flat {EVENT.feeLabel}, paid on Unstop. Registrations close 25
                October 2026.
              </p>
              <Link
                to={REGISTER_URL}
                className="ah-magnetic mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-7 py-3.5 font-mono text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground"
              >
                Register your team
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </section>

        <PrizePool />
        <Faq />
        <Sponsors />
      </main>
      <SiteFooter />
    </>
  );
}
