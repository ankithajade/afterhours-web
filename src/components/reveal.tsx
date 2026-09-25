import { useEffect, useState, type ElementType, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Motion components must be created once per element type. Creating them
 * inside render produces a new component type every render, which makes React
 * remount the whole subtree (inputs lose focus and state).
 */
const motionCache = new Map<ElementType, ElementType>();
export function motionFor(as: ElementType): ElementType {
  let cached = motionCache.get(as);
  if (!cached) {
    cached = motion.create(as as never) as ElementType;
    motionCache.set(as, cached);
  }
  return cached;
}

/** Scroll-triggered reveal, powered by motion. Transform/opacity only. */
export function Reveal({
  children,
  delay = 0,
  as = "div",
  className,
  id,
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
  id?: string;
}) {
  const reduced = useReducedMotion();
  const MotionTag = motionFor(as) as ElementType;

  return (
    <MotionTag
      id={id}
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 34, filter: "blur(4px)" }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: false, margin: "0px 0px -12% 0px" }}
      transition={{
        duration: reduced ? 0.25 : 0.75,
        delay: delay / 1000,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Coordinated stagger: a SINGLE viewport trigger on the parent drives every
 * child in DOM order. Children must be <RevealItem>. This replaces per-child
 * viewport triggers, which fired out of order depending on scroll position.
 */
export function RevealGroup({
  children,
  as = "div",
  className,
  stagger = 0.1,
  delay = 0,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const MotionTag = motionFor(as) as ElementType;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, margin: "0px 0px -12% 0px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </MotionTag>
  );
}

/** A child of RevealGroup. Its animation is sequenced by the parent. */
export function RevealItem({
  children,
  as = "div",
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const MotionTag = motionFor(as) as ElementType;

  return (
    <MotionTag
      className={className}
      variants={{
        hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 28, filter: "blur(4px)" },
        show: {
          opacity: 1,
          ...(reduced ? {} : { y: 0, filter: "blur(0px)" }),
          transition: { duration: reduced ? 0.25 : 0.65, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </MotionTag>
  );
}

/** True once the component has hydrated — avoids SSR/client mismatches. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

/** Respects the OS reduced-motion setting at runtime. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}
