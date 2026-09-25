/**
 * Fallback content for AFTERHOURS 1.0.
 *
 * Everything here is editable from the organizer dashboard (`site_content`
 * table). These values are only the defaults used before the database
 * responds, or if a key has been deleted.
 */

export const EVENT = {
  name: "AFTERHOURS 1.0",
  presenter: "HEXAVERSE CLOUDFEST '26 PRESENTS",
  title: "AFTERHOURS",
  version: "1.0",
  subhead: "CODE BEYOND THE CLOCK",
  subheadAccentWord: "BEYOND",
  tagline: "Inter-College 24-Hour Technical Hackathon",
  organizerLine:
    "Organized by Department of Computer Science & Engineering, in association with AWS Student Builder Group, DBIT",
  blurb:
    "One night. One room. One build. AFTERHOURS 1.0 is a 24-hour hackathon where teams ship something real between sunset and sunset.",
  /** 30 Oct 2026, 09:30 IST — stored as a UTC instant so every visitor sees the same countdown. */
  startsAtIso: "2026-10-30T09:30:00+05:30",
  /** 31 Oct 2026, 09:30 IST — end of the 24-hour build window. */
  endsAtIso: "2026-10-31T09:30:00+05:30",
  startTimeLabel: "Starts 09:30 IST",
  datesLabel: "30 – 31 October 2026",
  venue: "DBIT Campus (A-Block)",
  feeInr: 1000,
  feeLabel: "₹1,000 per team",
  /** Team size counts the lead. 2 to 4 people in total. */
  teamSize: "2 – 4 members, including the team lead",
  teamMin: 2,
  teamMax: 4,
  prizePoolLabel: "₹35,000",
} as const;

export type SocialItem = { label: string; href: string; icon: string };

export const SOCIALS: SocialItem[] = [
  { label: "Instagram", href: "https://www.instagram.com/awssbg_dbit", icon: "instagram" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/aws-student-builders-group-at-don-bosco-institute-of-technology/",
    icon: "linkedin",
  },
  { label: "WhatsApp", href: "https://whatsapp.com/channel/0029Vb76rEYATRSlFR1mOg2X", icon: "whatsapp" },
  { label: "Email", href: "mailto:aws.sbg@dbit.co.in", icon: "email" },
];

export const CONTACT_EMAIL = "aws.sbg@dbit.co.in";

/** Unstop listing — the final external step, linked from the /register page. */
export const UNSTOP_URL =
  "https://unstop.com/p/afterhours-10-don-bosco-institute-of-technology-bengaluru-1735661";

/** Every "register" CTA points at the on-site info page first. */
export const REGISTER_URL = "/register";

export type TimelineItem = {
  date: string;
  dateISO: string;
  title: string;
  description: string;
  kind: "milestone" | "event";
};

export const TIMELINE: TimelineItem[] = [
  {
    date: "18 OCTOBER",
    dateISO: "2026-10-18",
    title: "Pre-Qualification Round Begins (Online)",
    description:
      "The online pre-qualification round opens. Registered teams attempt it remotely — no travel, no venue.",
    kind: "milestone",
  },
  {
    date: "25 OCTOBER",
    dateISO: "2026-10-25",
    title: "Qualified Teams Announced",
    description:
      "Results of the pre-qualification round are published. Qualified teams are confirmed for the offline finale.",
    kind: "milestone",
  },
  {
    date: "30 – 31 OCTOBER",
    dateISO: "2026-10-30",
    title: "AfterHours 1.0 (24-Hour Hackathon — Offline)",
    description:
      "The clock starts at 09:30 IST on 30 October and stops exactly 24 hours later. On campus, in one room, start to finish.",
    kind: "event",
  },
];

export type DetailItem = {
  label: string;
  value: string;
  hint?: string;
  tbc?: boolean;
};

export const DETAILS: DetailItem[] = [
  { label: "Format", value: "24-hour in-person hackathon" },
  { label: "Dates", value: EVENT.datesLabel, hint: "Starts 09:30 IST, 30 October" },
  { label: "Venue", value: "DBIT Campus (A-Block)" },
  { label: "Team size", value: "2 – 4 members", hint: "The team lead is one of the 2 – 4." },
  {
    label: "Mixed-college teams",
    value: "Allowed",
    hint: "Members from different colleges may team up. Each member registers with their own college details.",
  },
  { label: "Registration fee", value: EVENT.feeLabel, hint: "Paid on Unstop at registration" },
  { label: "Food", value: "Provided", hint: "Day 1: lunch and dinner. Day 2: breakfast." },
  {
    label: "Accommodation",
    value: "Resting areas only",
    hint: "Indoor resting areas on campus for the overnight stretch. No hotel or dormitory-style accommodation is arranged.",
  },
];

export type AboutCard = { title: string; body: string };

export const ABOUT_LEDE =
  "AFTERHOURS 1.0 is an inter-college hackathon held offline at DBIT. Teams clear an online pre-qualification round first, then the qualified teams sit down together for a single 24-hour window on 30 – 31 October. Problem statements drop at the start line; whatever is working when the clock stops is what gets judged.";

export const ABOUT_CARDS: AboutCard[] = [
  {
    title: "Build overnight",
    body: "The window opens at 09:30 IST on 30 October and closes exactly 24 hours later. No extensions, no overnight sneak-work before the start.",
  },
  {
    title: "Qualify before you build",
    body: "Most hackathons take anyone who signs up. Here an online round on 18 October filters the field first, so the 24 hours are spent alongside teams that already proved they can ship.",
  },
  {
    title: "What 'beyond the clock' means",
    body: "Judging looks at what survives hour 18 — a demo that runs, choices you can defend, and scope you were honest about. Come if you would rather finish something small and real than pitch something big and imaginary.",
  },
];

export const SPONSORS_BODY =
  "If your team wants to back the event, get in touch and we will send the sponsorship deck.";

export type FaqItem = { q: string; a: string; tbc?: boolean };

export const FAQ: FaqItem[] = [
  {
    q: "Who can participate, and how many people can be on a team?",
    a: "Students registering as a team of 2 to 4 people in total, including the team lead. The lead registers on behalf of the team and provides their college USN. There is no separate slot for the lead — they are one of the 2 to 4.",
  },
  {
    q: "Can my team have members from different colleges?",
    a: "Yes. Mixed-college teams are allowed. Each member registers with their own college name and ID number.",
  },
  {
    q: "Is there a round before the hackathon?",
    a: "Yes. An online pre-qualification round begins on 18 October, and the qualified teams are announced on 25 October. Only qualified teams attend the 24-hour offline finale on 30 – 31 October.",
  },
  {
    q: "What happens if my team doesn't qualify for the main round?",
    a: "₹750 of the ₹1,000 registration fee is refunded. The remaining ₹250 covers the pre-qualification round's processing, evaluation, and coordination costs, which are incurred regardless of outcome.",
  },
  {
    q: "What does the ₹1,000 registration fee cover?",
    a: "The ₹1,000 per-team fee covers your team's registration, evaluation in the pre-qualification round, and on-campus logistics during the 24-hour finale, including the provided meals and resting areas. It's a one-time payment per team, not per member.",
  },
  {
    q: "Is food provided?",
    a: "Yes. Lunch and dinner on day 1, and breakfast on day 2, are provided at the venue.",
  },
  {
    q: "Is accommodation provided?",
    a: "Not in the hotel or dormitory sense. Indoor resting areas are available on campus through the night, so bring anything you need to be comfortable.",
  },
  {
    q: "Is the hackathon online or offline?",
    a: "The pre-qualification round is online. The 24-hour hackathon itself is offline, at DBIT Campus (A-Block).",
  },
  {
    q: "Where do I register?",
    a: "Registration is handled on Unstop. The register buttons on this page take you to the AFTERHOURS 1.0 listing, where you'll find the full instructions and can complete your team's registration and payment.",
  },
  {
    q: "How do I know my slot is confirmed?",
    a: "Unstop confirms your registration once the payment goes through. Keep the confirmation from Unstop — that is your proof of registration.",
  },
];


export type Coordinator = {
  name: string;
  phone?: string;
  role?: string;
  designation?: string;
  faculty?: boolean;
};

export const COORDINATORS: Coordinator[] = [
  { name: "Madhu T K", phone: "+91 9353683822", designation: "AWS SBG Leader" },
  { name: "Ankitha Jade", phone: "+91 6360024049", designation: "AWS SBG Core Member" },
  { name: "Sadhana S", phone: "+91 9141800861", designation: "AWS SBG Core Member" },
  {
    name: "Dr. Hemanth Kumar N P",
    role: "General Queries",
    faculty: true,
  },
];

