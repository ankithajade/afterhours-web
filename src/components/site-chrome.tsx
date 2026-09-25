import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Globe, Instagram, Linkedin, Mail, MessageCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme";
import { ClockGlyph } from "@/components/clock-glyph";
import { REGISTER_URL } from "@/lib/event-data";
import { StaggeredMenu } from "@/components/staggered-menu/StaggeredMenu";
import { useContent } from "@/lib/content";
import awsSbgLogoDark from "@/assets/aws-sbg-logo-white.svg.asset.json";
import awsSbgLogoLight from "@/assets/aws-sbg-logo-black.svg.asset.json";

const NAV = [
  { label: "About", link: "/#about" },
  { label: "Timeline", link: "/#timeline" },
  { label: "Details", link: "/#details" },
  { label: "Prizes", link: "/#prizes" },
  { label: "FAQ", link: "/#faq" },
  { label: "Register", link: REGISTER_URL },
];

const SOCIAL_ICONS: Record<string, typeof Instagram> = {
  instagram: Instagram,
  linkedin: Linkedin,
  whatsapp: MessageCircle,
  email: Mail,
};

export function SiteHeader() {
  const { socials } = useContent();

  /** The wordmark scrolls the page back to the top. */
  const goHome = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const left = (
    <button
      type="button"
      onClick={goHome}
      className="group flex items-center gap-2"
      aria-label="AFTERHOURS 1.0 — back to top"
    >
      <ClockGlyph
        strokeWidth={1.4}
        className="h-5 w-5 text-primary transition-transform duration-300 group-hover:rotate-12"
      />
      <span className="hidden font-display text-[0.95rem] font-bold uppercase tracking-[0.18em] sm:inline">
        After<span className="text-primary">hours</span>
      </span>
    </button>
  );

  const right = (
    <div className="flex min-w-0 items-center gap-2 sm:gap-3.5">
      {/* AWS SBG logo — switches automatically between dark/light theme variants. */}
      <img
        src={awsSbgLogoLight.url}
        alt="AWS Student Builder Group"
        loading="eager"
        className="h-7 w-auto max-w-[10rem] object-contain dark:hidden"
      />
      <img
        src={awsSbgLogoDark.url}
        alt="AWS Student Builder Group"
        loading="eager"
        className="hidden h-7 w-auto max-w-[10rem] object-contain dark:block"
      />
      <span aria-hidden="true" className="hidden h-4 w-px bg-border sm:block" />
      <ThemeToggle />
    </div>
  );

  return (
    <>
      {/* One fixed header unit: nav row + compact college caption scroll together. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[3.4rem] border-b border-border/60 bg-background/80 backdrop-blur-md"
      />
      <StaggeredMenu
        items={NAV}
        panelCta={{ label: "Register your team", link: REGISTER_URL }}
        socialItems={socials
          .filter((s) => s.href)
          .map((s) => ({
            label: s.label,
            link: s.icon === "email" && !s.href.startsWith("mailto:") ? `mailto:${s.href}` : s.href,
            icon: SOCIAL_ICONS[s.icon] ?? Globe,
          }))}

        leftContent={left}
        rightContent={right}
      />
      <div aria-hidden="true" className="h-[3.4rem]" />
    </>
  );
}


export function SiteFooter() {
  const { event, hero, socials, coordinators } = useContent();

  return (
    <footer className="mt-[var(--section-gap)] border-t border-border bg-surface/50">
      <div className="mx-auto grid w-full max-w-[84rem] gap-10 px-4 py-11 sm:px-8 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold uppercase tracking-[0.16em]">
            After<span className="text-primary">hours</span> {hero.version}
          </p>
          <p className="mt-3 max-w-xs text-base leading-relaxed text-muted-foreground">
            {hero.tagline} · {event.datesLabel}. {event.startTimeLabel}.
          </p>

          <ul className="mt-6 flex items-center gap-3">
            {socials.map((s) => {
              const Icon = SOCIAL_ICONS[s.icon] ?? Globe;
              const href = s.href
                ? s.icon === "email" && !s.href.startsWith("mailto:")
                  ? `mailto:${s.href}`
                  : s.href
                : "#";
              return (
                <li key={s.label}>
                  <motion.a
                    href={href}
                    aria-label={s.label}
                    title={s.href ? s.label : `${s.label} — link to be added`}
                    whileHover={{ y: -3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    {...(s.href.startsWith("http")
                      ? { target: "_blank", rel: "noreferrer noopener" }
                      : {})}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <Icon aria-hidden="true" strokeWidth={1.5} className="h-4 w-4" />
                  </motion.a>
                </li>
              );
            })}
          </ul>

          {coordinators.some((c) => c.faculty) && (

            <div className="mt-8 border-t border-border pt-5">
              <h2 className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Faculty coordinator
              </h2>
              <ul className="mt-3 space-y-2">
                {coordinators
                  .filter((c) => c.faculty)
                  .map((c, i) => (
                    <li key={i} className="text-base">
                      <span className="text-foreground">{c.name}</span>
                      {c.role ? <span className="text-muted-foreground"> — {c.role}</span> : null}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <h2 className="font-mono text-xs uppercase tracking-[0.28em] text-primary">Links</h2>
          <ul className="mt-4 space-y-2 text-base">
            <li>
              <Link
                to={REGISTER_URL}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Register your team
              </Link>
            </li>
            <li>
              <a href="/#sponsors" className="text-muted-foreground transition-colors hover:text-foreground">
                Become a sponsor
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-mono text-xs uppercase tracking-[0.28em] text-primary">
            Student coordinators
          </h2>
          <ul className="mt-4 space-y-3">
            {coordinators
              .filter((c) => !c.faculty)
              .map((c, i) => (
                <li key={i} className="flex items-start justify-between gap-4 text-base">
                  <span className="min-w-0">
                    <span className="block text-foreground">{c.name}</span>
                    {c.designation ? (
                      <span className="block text-sm text-muted-foreground">{c.designation}</span>
                    ) : null}
                  </span>
                  {c.phone ? (
                    <a
                      href={`tel:${c.phone.replace(/\s/g, "")}`}
                      className="shrink-0 font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {c.phone}
                    </a>
                  ) : null}
                </li>
              ))}
          </ul>
        </div>

      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto flex w-full max-w-[84rem] flex-col gap-2 px-4 py-6 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© {new Date().getFullYear()} AFTERHOURS 1.0</span>
          <span>Built for the long night</span>
        </div>
      </div>
    </footer>
  );
}
