CREATE TABLE public.site_content (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  kind text NOT NULL DEFAULT 'text',
  section text NOT NULL DEFAULT 'general',
  label text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site content"
  ON public.site_content FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Organizers can insert site content"
  ON public.site_content FOR INSERT
  TO authenticated
  WITH CHECK (is_organizer(auth.uid()));

CREATE POLICY "Organizers can update site content"
  ON public.site_content FOR UPDATE
  TO authenticated
  USING (is_organizer(auth.uid()))
  WITH CHECK (is_organizer(auth.uid()));

CREATE POLICY "Organizers can delete site content"
  ON public.site_content FOR DELETE
  TO authenticated
  USING (is_organizer(auth.uid()));

CREATE TRIGGER site_content_touch_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.site_content (key, value, kind, section, label, sort_order) VALUES
('hero.eyebrow', '"HEXAVERSE CLOUDFEST ''26 PRESENTS"', 'text', 'hero', 'Eyebrow', 10),
('hero.title', '"AFTERHOURS"', 'text', 'hero', 'Headline', 20),
('hero.version', '"1.0"', 'text', 'hero', 'Version tag', 30),
('hero.subhead', '"CODE BEYOND THE CLOCK"', 'text', 'hero', 'Subhead', 40),
('hero.subhead_accent_word', '"BEYOND"', 'text', 'hero', 'Accented word in subhead', 45),
('hero.tagline', '"Inter-College 24-Hour Technical Hackathon"', 'text', 'hero', 'Tagline', 50),
('hero.blurb', '"One night. One room. One build. AFTERHOURS 1.0 is a 24-hour hackathon where teams ship something real between sunset and sunset."', 'longtext', 'hero', 'Intro paragraph', 60),
('hero.organizer_line', '"Organized by Department of Computer Science & Engineering, in association with AWS Student Builder Group, DBIT"', 'longtext', 'hero', 'Organizer lockup line', 70),
('event.dates_label', '"30 – 31 October 2026"', 'text', 'event', 'Dates label', 10),
('event.venue', '"To be confirmed"', 'text', 'event', 'Venue', 20),
('event.fee_label', '"₹1,000 per team"', 'text', 'event', 'Registration fee label', 30),
('event.team_size', '"2 – 4 members, including the team lead"', 'text', 'event', 'Team size', 40),
('event.prize_pool', '"₹35,000+"', 'text', 'event', 'Prize pool', 50),
('event.starts_at', '"2026-10-30T09:30:00+05:30"', 'text', 'event', 'Event start (IST, ISO 8601)', 60),
('event.ends_at', '"2026-10-31T09:30:00+05:30"', 'text', 'event', 'Event end (IST, ISO 8601)', 70),
('event.start_time_label', '"Starts 09:30 IST"', 'text', 'event', 'Start time label', 80),
('about.lede', '"AFTERHOURS 1.0 is an inter-college hackathon held offline at DBIT. Teams clear an online pre-qualification round first, then the qualified teams sit down together for a single 24-hour window on 30 – 31 October. Problem statements drop at the start line; whatever is working when the clock stops is what gets judged."', 'longtext', 'about', 'About lede', 10),
('about.cards', '[{"title":"Build overnight","body":"The window opens at 09:30 IST on 30 October and closes exactly 24 hours later. No extensions, no overnight sneak-work before the start."},{"title":"Qualify before you build","body":"Most hackathons take anyone who signs up. Here an online round on 18 October filters the field first, so the 24 hours are spent alongside teams that already proved they can ship."},{"title":"What ''beyond the clock'' means","body":"Judging looks at what survives hour 18 — a demo that runs, choices you can defend, and scope you were honest about. Come if you would rather finish something small and real than pitch something big and imaginary."}]', 'list', 'about', 'About cards', 20),
('timeline.items', '[{"date":"18 OCTOBER","dateISO":"2026-10-18","title":"Pre-Qualification Round Begins (Online)","description":"The online pre-qualification round opens. Registered teams attempt it remotely — no travel, no venue.","kind":"milestone"},{"date":"25 OCTOBER","dateISO":"2026-10-25","title":"Qualified Teams Announced","description":"Results of the pre-qualification round are published. Qualified teams are confirmed for the offline finale.","kind":"milestone"},{"date":"30 – 31 OCTOBER","dateISO":"2026-10-30","title":"AfterHours 1.0 (24-Hour Hackathon — Offline)","description":"The clock starts at 09:30 IST on 30 October and stops exactly 24 hours later. On campus, in one room, start to finish.","kind":"event"}]', 'list', 'timeline', 'Timeline entries', 10),
('details.items', '[{"label":"Format","value":"24-hour in-person hackathon"},{"label":"Dates","value":"30 – 31 October 2026","hint":"Starts 09:30 IST, 30 October"},{"label":"Venue","value":"To be confirmed","tbc":true},{"label":"Team size","value":"2 – 4 members","hint":"The team lead is one of the 2 – 4."},{"label":"Registration fee","value":"₹1,000 per team","hint":"Paid online at registration"},{"label":"Prize pool","value":"₹35,000+"},{"label":"Mixed-college teams","value":"To be confirmed","hint":"Whether members from different colleges may team up has not been finalised.","tbc":true},{"label":"Food & accommodation","value":"To be confirmed","hint":"Overnight arrangements will be announced before the offline round.","tbc":true}]', 'list', 'details', 'Event detail cards', 10),
('faq.items', '[{"q":"Who can participate?","a":"Students registering as a team of 2 to 4 people in total, including the team lead. The lead registers on behalf of the team and provides their college USN."},{"q":"How many people can be on a team?","a":"Between 2 and 4, counting the team lead. There is no separate slot for the lead — they are one of the 2 to 4."},{"q":"Is there a round before the hackathon?","a":"Yes. An online pre-qualification round begins on 18 October, and the qualified teams are announced on 25 October. Only qualified teams attend the 24-hour offline finale on 30 – 31 October."},{"q":"What does the ₹1,000 cover?","a":"It is a single per-team registration fee, paid once online at registration. It is not per person."},{"q":"Is the hackathon online or offline?","a":"The pre-qualification round is online. The 24-hour hackathon itself is offline and on campus at DBIT."},{"q":"I registered but abandoned the payment. What now?","a":"Nothing is lost. Your team is saved as pending with a reference ID. Use the ''Resume payment'' page with that reference ID to pay and confirm your slot."},{"q":"How do I know my slot is confirmed?","a":"Your registration is confirmed only after the payment is verified on our servers — not just after the payment screen closes. You will receive a confirmation email with your team name and reference ID."}]', 'list', 'faq', 'FAQ entries', 10),
('sponsors.body', '"If your team wants to back the event, get in touch and we will send the sponsorship deck."', 'longtext', 'sponsors', 'Sponsor pitch', 10),
('sponsors.contact_email', '""', 'text', 'sponsors', 'Sponsor contact email', 20),
('socials.items', '[{"label":"Instagram","href":"","icon":"instagram"},{"label":"LinkedIn","href":"","icon":"linkedin"},{"label":"WhatsApp","href":"","icon":"whatsapp"},{"label":"Email","href":"","icon":"email"}]', 'list', 'socials', 'Social links', 10),
('coordinators.items', '[{"name":"Student Coordinator","role":"Registrations","phone":"+91 XXXXXXXXXX"},{"name":"Student Coordinator","role":"Logistics","phone":"+91 XXXXXXXXXX"},{"name":"Faculty Coordinator","role":"General queries","phone":"+91 XXXXXXXXXX"}]', 'list', 'coordinators', 'Coordinators', 10),
('assets.dbit_logo', '""', 'image', 'assets', 'DBIT crest', 10),
('assets.aws_logo', '""', 'image', 'assets', 'AWS Student Builder Group logo', 20);