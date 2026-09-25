"use client";
import { motion, type Transition, type Variants } from "motion/react";
import type { ElementType, ReactNode } from "react";
import { motionFor } from "@/components/reveal";

/**
 * motion-primitives / TextEffect — staggered per-character or per-word entrance.
 * Trimmed to the variants this site uses.
 */
type PresetKey = "fade-in-blur" | "slide" | "fade";

const PRESETS: Record<PresetKey, { item: Variants }> = {
  "fade-in-blur": {
    item: {
      hidden: { opacity: 0, y: "0.35em", filter: "blur(8px)" },
      visible: { opacity: 1, y: 0, filter: "blur(0px)" },
    },
  },
  slide: {
    item: {
      hidden: { opacity: 0, y: "0.5em" },
      visible: { opacity: 1, y: 0 },
    },
  },
  fade: {
    item: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  },
};

export function TextEffect({
  children,
  per = "word",
  preset = "fade-in-blur",
  as: Tag = "p",
  className,
  delay = 0,
  speed = 0.04,
  transition,
  trigger = "mount",
}: {
  children: string;
  per?: "word" | "char";
  preset?: PresetKey;
  as?: ElementType;
  className?: string;
  delay?: number;
  speed?: number;
  transition?: Transition;
  /** "mount" animates immediately; "inView" waits until scrolled into view. */
  trigger?: "mount" | "inView";
}) {
  const MotionTag = motionFor(Tag) as ElementType;
  const pieces = per === "char" ? Array.from(children) : children.split(" ");
  const item = PRESETS[preset].item;
  const base: Transition = transition ?? {
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1],
  };

  const trig =
    trigger === "inView"
      ? { whileInView: "visible", viewport: { once: false, margin: "0px 0px -12% 0px" } }
      : { animate: "visible" };

  return (
    <MotionTag
      className={className}
      initial="hidden"
      {...trig}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: speed, delayChildren: delay } },
      }}
      aria-label={children}
    >

      {pieces.map((piece, i) => (
        <motion.span
          key={`${piece}-${i}`}
          aria-hidden="true"
          className="inline-block whitespace-pre"
          variants={item}
          transition={base}
        >
          {per === "char" ? piece : `${piece}${i < pieces.length - 1 ? " " : ""}`}
        </motion.span>
      ))}
    </MotionTag>
  );
}

/** motion-primitives / AnimatedGroup — staggers direct children into view. */
export function AnimatedGroup({
  children,
  className,
  delay = 0,
  speed = 0.08,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  speed?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: speed, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export const groupItemVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};
