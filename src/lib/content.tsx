import { createContext, useContext, type ReactNode } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getSiteContent, type SiteContentRow } from "@/lib/site-content.functions";
import {
  ABOUT_CARDS,
  ABOUT_LEDE,
  CONTACT_EMAIL,
  COORDINATORS,
  DETAILS,
  EVENT,
  FAQ,
  SOCIALS,
  SPONSORS_BODY,
  TIMELINE,
  type AboutCard,
  type Coordinator,
  type DetailItem,
  type FaqItem,
  type SocialItem,
  type TimelineItem,
} from "@/lib/event-data";

export type SiteContent = {
  hero: {
    eyebrow: string;
    title: string;
    version: string;
    subhead: string;
    subheadAccentWord: string;
    tagline: string;
    blurb: string;
    organizerLine: string;
  };
  event: {
    startsAt: string;
    endsAt: string;
    startTimeLabel: string;
    datesLabel: string;
    venue: string;
    feeLabel: string;
    teamSize: string;
    prizePool: string;
  };
  about: { lede: string; cards: AboutCard[] };
  timeline: TimelineItem[];
  details: DetailItem[];
  faq: FaqItem[];
  socials: SocialItem[];
  coordinators: Coordinator[];
  sponsors: { body: string; contactEmail: string };
  assets: { dbitLogo: string; awsLogo: string };
};

/** Every editable field, keyed exactly as it is stored in the database. */
export const CONTENT_FIELDS = [
  { key: "hero.eyebrow", label: "Hero eyebrow", kind: "text" },
  { key: "hero.title", label: "Hero title", kind: "text" },
  { key: "hero.version", label: "Version tag", kind: "text" },
  { key: "hero.subhead", label: "Hero subhead", kind: "text" },
  { key: "hero.subhead_accent_word", label: "Subhead accent word", kind: "text" },
  { key: "hero.tagline", label: "Hero tagline", kind: "text" },
  { key: "hero.blurb", label: "Hero blurb", kind: "textarea" },
  { key: "hero.organizer_line", label: "Organizer line", kind: "textarea" },
  { key: "event.starts_at", label: "Start (ISO with offset)", kind: "text" },
  { key: "event.ends_at", label: "End (ISO with offset)", kind: "text" },
  { key: "event.start_time_label", label: "Start time label", kind: "text" },
  { key: "event.dates_label", label: "Dates label", kind: "text" },
  { key: "event.venue", label: "Venue", kind: "text" },
  { key: "event.fee_label", label: "Fee label", kind: "text" },
  { key: "event.team_size", label: "Team size label", kind: "text" },
  { key: "event.prize_pool", label: "Prize pool", kind: "text" },
  { key: "about.lede", label: "About lede", kind: "textarea" },
  { key: "about.cards", label: "About cards", kind: "json" },
  { key: "timeline.items", label: "Timeline items", kind: "json" },
  { key: "details.items", label: "Event details", kind: "json" },
  { key: "faq.items", label: "FAQ items", kind: "json" },
  { key: "socials.items", label: "Social links", kind: "json" },
  { key: "coordinators.items", label: "Coordinators", kind: "json" },
  { key: "sponsors.body", label: "Sponsors copy", kind: "textarea" },
  { key: "sponsors.contact_email", label: "Sponsor contact email", kind: "text" },
  { key: "assets.dbit_logo", label: "DBIT logo (image)", kind: "image" },
  { key: "assets.aws_logo", label: "AWS SBG logo (image)", kind: "image" },
] as const;

export type ContentFieldKind = (typeof CONTENT_FIELDS)[number]["kind"];

function toMap(rows: SiteContentRow[]) {
  const map = new Map<string, unknown>();
  for (const row of rows) map.set(row.key, row.value);
  return map;
}

function str(map: Map<string, unknown>, key: string, fallback: string) {
  const v = map.get(key);
  return typeof v === "string" && v.length > 0 ? v : fallback;
}

function rawStr(map: Map<string, unknown>, key: string, fallback = "") {
  const v = map.get(key);
  return typeof v === "string" ? v : fallback;
}

function list<T>(map: Map<string, unknown>, key: string, fallback: T[]): T[] {
  const v = map.get(key);
  return Array.isArray(v) && v.length > 0 ? (v as T[]) : fallback;
}

export function buildSiteContent(rows: SiteContentRow[]): SiteContent {
  const m = toMap(rows);
  return {
    hero: {
      eyebrow: str(m, "hero.eyebrow", EVENT.presenter),
      title: str(m, "hero.title", EVENT.title),
      version: str(m, "hero.version", EVENT.version),
      subhead: str(m, "hero.subhead", EVENT.subhead),
      subheadAccentWord: str(m, "hero.subhead_accent_word", EVENT.subheadAccentWord),
      tagline: str(m, "hero.tagline", EVENT.tagline),
      blurb: str(m, "hero.blurb", EVENT.blurb),
      organizerLine: str(m, "hero.organizer_line", EVENT.organizerLine),
    },
    event: {
      startsAt: str(m, "event.starts_at", EVENT.startsAtIso),
      endsAt: str(m, "event.ends_at", EVENT.endsAtIso),
      startTimeLabel: str(m, "event.start_time_label", EVENT.startTimeLabel),
      datesLabel: str(m, "event.dates_label", EVENT.datesLabel),
      venue: str(m, "event.venue", EVENT.venue),
      feeLabel: str(m, "event.fee_label", EVENT.feeLabel),
      teamSize: str(m, "event.team_size", EVENT.teamSize),
      prizePool: str(m, "event.prize_pool", EVENT.prizePoolLabel),
    },
    about: {
      lede: str(m, "about.lede", ABOUT_LEDE),
      cards: list<AboutCard>(m, "about.cards", ABOUT_CARDS),
    },
    timeline: list<TimelineItem>(m, "timeline.items", TIMELINE),
    details: list<DetailItem>(m, "details.items", DETAILS),
    faq: list<FaqItem>(m, "faq.items", FAQ),
    socials: list<SocialItem>(m, "socials.items", SOCIALS),
    coordinators: list<Coordinator>(m, "coordinators.items", COORDINATORS),
    sponsors: {
      body: str(m, "sponsors.body", SPONSORS_BODY),
      contactEmail: rawStr(m, "sponsors.contact_email", CONTACT_EMAIL),
    },
    assets: {
      dbitLogo: rawStr(m, "assets.dbit_logo"),
      awsLogo: rawStr(m, "assets.aws_logo"),
    },
  };
}

export const siteContentQueryOptions = queryOptions({
  queryKey: ["site-content"],
  queryFn: () => getSiteContent(),
  staleTime: 60_000,
});

const ContentContext = createContext<SiteContent>(buildSiteContent([]));

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const { data } = useSuspenseQuery(siteContentQueryOptions);
  return (
    <ContentContext.Provider value={buildSiteContent(data)}>{children}</ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}

/** Countdown anchors as epoch milliseconds. */
export function eventInstants(content: SiteContent) {
  const start = Date.parse(content.event.startsAt);
  const end = Date.parse(content.event.endsAt);
  return {
    startMs: Number.isNaN(start) ? Date.parse(EVENT.startsAtIso) : start,
    endMs: Number.isNaN(end) ? Date.parse(EVENT.endsAtIso) : end,
  };
}
