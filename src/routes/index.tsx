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
  RulesSummary,
  Sponsors,
  Timeline,
} from "@/components/home/sections";
import { Reveal } from "@/components/reveal";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { EVENT, REGISTER_URL } from "@/lib/event-data";

const description =
  "AFTERHOURS 1.0 is DBIT, Bengaluru's flagship 24-hour inter-college hackathon on 30–31 October 2026, hosted by AWS Student Builder Group, DBIT. Register your team of 2–4 on Unstop.";

const SITE_URL = "https://awsevents.dbit.edu.in/afterhours-1.0/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AFTERHOURS 1.0 — 24-Hour Hackathon | DBIT AWS Student Club" },
      { name: "description", content: description },
      { property: "og:title", content: "AFTERHOURS 1.0 — DBIT's 24-Hour Hackathon" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: `${SITE_URL}og-afterhours.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "AFTERHOURS 1.0 — 24-hour inter-college hackathon at DBIT Bengaluru, 30–31 October 2026" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AFTERHOURS 1.0 — DBIT's 24-Hour Hackathon" },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: `${SITE_URL}og-afterhours.jpg` },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
  component: Home,
});

function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "AFTERHOURS 1.0 — 24-Hour Hackathon",
    description: EVENT.blurb,
    startDate: "2026-10-30T09:30:00+05:30",
    endDate: "2026-10-31T12:00:00+05:30",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    url: SITE_URL,
    image: `${SITE_URL}og-afterhours.jpg`,
    location: {
      "@type": "Place",
      name: "Don Bosco Institute of Technology (DBIT)",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Kumbalagodu, Mysore Road",
        addressLocality: "Bengaluru",
        addressRegion: "Karnataka",
        postalCode: "560074",
        addressCountry: "IN",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "DBIT AWS Student Club",
      url: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      price: "1000",
      priceCurrency: "INR",
      url: "https://unstop.com/hackathons/afterhours-10-don-bosco-institute-of-technology-dbit-mumbai-1463765",
      availability: "https://schema.org/InStock",
      validFrom: "2026-10-01T00:00:00+05:30",
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

        <RulesSummary />
        
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
                2–4 members, team lead included. ₹1,000 per team on Unstop
                — registrations close 22 October 2026.
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


