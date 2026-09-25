"use client";
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import "./staggered-menu.css";

/**
 * React Bits — StaggeredMenu (JS/CSS variant), adapted to TypeScript and the
 * AfterHours design tokens. Header slots take arbitrary nodes so the wordmark,
 * AWS mark, theme toggle and CTA keep working as before.
 */
export type StaggeredMenuItem = { label: string; link: string; ariaLabel?: string };
export type StaggeredSocial = {
  label: string;
  link: string;
  icon?: React.ComponentType<{
    className?: string;
    strokeWidth?: number;
    "aria-hidden"?: boolean | "true" | "false";
  }>;

};


type Props = {
  items: StaggeredMenuItem[];
  socialItems?: StaggeredSocial[];
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  panelCta?: { label: string; link: string };
  colors?: string[];
  accentColor?: string;
  displayItemNumbering?: boolean;
  closeOnClickAway?: boolean;
};

export function StaggeredMenu({
  items,
  socialItems = [],
  leftContent,
  rightContent,
  panelCta,
  colors = ["var(--color-surface)", "var(--color-primary)"],
  accentColor = "var(--color-primary)",
  displayItemNumbering = true,
  closeOnClickAway = true,
}: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const openRef = useRef(false);
  const panelRef = useRef<HTMLElement | null>(null);
  const preLayersRef = useRef<HTMLDivElement | null>(null);
  const preLayerElsRef = useRef<Element[]>([]);
  const plusHRef = useRef<HTMLSpanElement | null>(null);
  const plusVRef = useRef<HTMLSpanElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);
  const textInnerRef = useRef<HTMLSpanElement | null>(null);
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const [textLines, setTextLines] = useState<string[]>(["Menu", "Close"]);

  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const spinTweenRef = useRef<gsap.core.Tween | null>(null);
  const textCycleAnimRef = useRef<gsap.core.Tween | null>(null);
  const busyRef = useRef(false);
  const reducedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = mq.matches;
    const onChange = () => (reducedRef.current = mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const d = (value: number) => (reducedRef.current ? 0.001 : value);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      if (!panel || !plusHRef.current || !plusVRef.current || !iconRef.current || !textInnerRef.current)
        return;

      const preLayers = preContainer
        ? Array.from(preContainer.querySelectorAll(".sm-prelayer"))
        : [];
      preLayerElsRef.current = preLayers;

      gsap.set([panel, ...preLayers], { xPercent: 100, opacity: 1 });
      if (preContainer) gsap.set(preContainer, { xPercent: 0, opacity: 1 });
      gsap.set(plusHRef.current, { transformOrigin: "50% 50%", rotate: 0 });
      gsap.set(plusVRef.current, { transformOrigin: "50% 50%", rotate: 90 });
      gsap.set(iconRef.current, { rotate: 0, transformOrigin: "50% 50%" });
      gsap.set(textInnerRef.current, { yPercent: 0 });
    });
    return () => ctx.revert();
  }, []);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    closeTweenRef.current?.kill();
    closeTweenRef.current = null;

    const itemEls = Array.from(panel.querySelectorAll(".sm-panel-itemLabel"));
    const numberEls = Array.from(
      panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item"),
    );
    const socialTitle = panel.querySelector(".sm-socials-title");
    const socialLinks = Array.from(panel.querySelectorAll(".sm-socials-link"));

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 8 });
    if (numberEls.length) gsap.set(numberEls, { "--sm-num-opacity": 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 22, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layers.forEach((el, i) => {
      tl.fromTo(el, { xPercent: 100 }, { xPercent: 0, duration: d(0.5), ease: "power4.out" }, i * 0.07);
    });
    const panelInsertTime = layers.length ? (layers.length - 1) * 0.07 + 0.08 : 0;
    const panelDuration = d(0.65);
    tl.fromTo(
      panel,
      { xPercent: 100 },
      { xPercent: 0, duration: panelDuration, ease: "power4.out" },
      panelInsertTime,
    );

    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15;
      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: d(0.9),
          ease: "power4.out",
          stagger: { each: 0.09, from: "start" },
        },
        itemsStart,
      );
      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: d(0.6),
            ease: "power2.out",
            "--sm-num-opacity": 1,
            stagger: { each: 0.08, from: "start" },
          },
          itemsStart + 0.1,
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;
      if (socialTitle)
        tl.to(socialTitle, { opacity: 1, duration: d(0.5), ease: "power2.out" }, socialsStart);
      if (socialLinks.length)
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: d(0.55),
            ease: "power3.out",
            stagger: { each: 0.08, from: "start" },
          },
          socialsStart + 0.04,
        );
    }

    openTlRef.current = tl;
    return tl;
  }, []);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback("onComplete", () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    const panel = panelRef.current;
    if (!panel) return;
    closeTweenRef.current?.kill();
    closeTweenRef.current = gsap.to([...preLayerElsRef.current, panel], {
      xPercent: 100,
      duration: d(0.32),
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => {
        busyRef.current = false;
      },
    });
  }, []);

  const animateIcon = useCallback((opening: boolean) => {
    const icon = iconRef.current;
    if (!icon) return;
    spinTweenRef.current?.kill();
    spinTweenRef.current = gsap.to(icon, {
      rotate: opening ? 225 : 0,
      duration: opening ? d(0.8) : d(0.35),
      ease: opening ? "power4.out" : "power3.inOut",
      overwrite: "auto",
    });
  }, []);

  const animateText = useCallback((opening: boolean) => {
    const inner = textInnerRef.current;
    if (!inner) return;
    textCycleAnimRef.current?.kill();
    const current = opening ? "Menu" : "Close";
    const target = opening ? "Close" : "Menu";
    const seq = [current];
    let last = current;
    for (let i = 0; i < 3; i++) {
      last = last === "Menu" ? "Close" : "Menu";
      seq.push(last);
    }
    if (last !== target) seq.push(target);
    seq.push(target);
    setTextLines(seq);

    gsap.set(inner, { yPercent: 0 });
    const finalShift = ((seq.length - 1) / seq.length) * 100;
    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: d(0.5 + seq.length * 0.07),
      ease: "power4.out",
    });
  }, []);

  const setOpenState = useCallback(
    (target: boolean) => {
      if (openRef.current === target) return;
      openRef.current = target;
      setOpen(target);
      if (target) playOpen();
      else playClose();
      animateIcon(target);
      animateText(target);
    },
    [playOpen, playClose, animateIcon, animateText],
  );

  useEffect(() => {
    if (!closeOnClickAway || !open) return;
    const onDown = (event: MouseEvent) => {
      const t = event.target as Node;
      if (panelRef.current?.contains(t) || toggleBtnRef.current?.contains(t)) return;
      setOpenState(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenState(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [closeOnClickAway, open, setOpenState]);

  const layerColors = colors.slice(0, 2);

  return (
    <div
      className="staggered-menu-wrapper fixed-wrapper"
      style={{ ["--sm-accent" as string]: accentColor }}
      data-position="right"
      data-open={open || undefined}
      data-scrolled={scrolled ? "true" : "false"}
    >
      <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
        {layerColors.map((c, i) => (
          <div key={i} className="sm-prelayer" style={{ background: c, opacity: i === 0 ? 1 : 0.9 }} />
        ))}
      </div>

      <header className="staggered-menu-header" aria-label="Main navigation header">
        {leftContent}
        <div className="flex items-center gap-3">
          {rightContent}
          <button
            ref={toggleBtnRef}
            className="sm-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="staggered-menu-panel"
            onClick={() => setOpenState(!openRef.current)}
            type="button"
          >
            <span className="sm-toggle-textWrap" aria-hidden="true">
              <span ref={textInnerRef} className="sm-toggle-textInner">
                {textLines.map((l, i) => (
                  <span className="sm-toggle-line" key={i}>
                    {l}
                  </span>
                ))}
              </span>
            </span>
            <span ref={iconRef} className="sm-icon" aria-hidden="true">
              <span ref={plusHRef} className="sm-icon-line" />
              <span ref={plusVRef} className="sm-icon-line sm-icon-line-v" />
            </span>
          </button>
        </div>
      </header>

      <aside
        id="staggered-menu-panel"
        ref={panelRef as React.RefObject<HTMLElement>}
        className="staggered-menu-panel"
        aria-hidden={!open}
      >
        <div className="sm-panel-inner">
          <ul className="sm-panel-list" role="list" data-numbering={displayItemNumbering || undefined}>
            {items.map((it, idx) => (
              <li className="sm-panel-itemWrap" key={it.label + idx}>
                <a
                  className="sm-panel-item"
                  href={it.link}
                  aria-label={it.ariaLabel ?? it.label}
                  onClick={() => setOpenState(false)}
                >
                  <span className="sm-panel-itemLabel">{it.label}</span>
                </a>
              </li>
            ))}
          </ul>

          {panelCta && (
            <a className="sm-panel-cta" href={panelCta.link} onClick={() => setOpenState(false)}>
              {panelCta.label}
            </a>
          )}

          {socialItems.length > 0 && (
            <div className="sm-socials" aria-label="Social links">
              <h3 className="sm-socials-title">Socials</h3>
              <ul className="sm-socials-list" role="list">
                {socialItems.map((s, i) => (
                  <li key={s.label + i}>
                    <a
                      href={s.link}
                      target={s.link.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="sm-socials-link"
                      aria-label={s.label}
                      title={s.label}
                    >
                      {s.icon ? (
                        <s.icon aria-hidden="true" strokeWidth={1.5} className="h-5 w-5" />
                      ) : (
                        s.label
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </aside>
    </div>
  );
}

export default StaggeredMenu;
