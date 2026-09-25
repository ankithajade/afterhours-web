import type { ReactNode } from "react";
import { motion } from "motion/react";
import { TextEffect } from "@/components/motion-primitives/text-effect";

export function SectionShell({
  id,
  eyebrow,
  title,
  lede,
  children,
  align = "left",
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  children: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <section
      id={id}
      className="relative mx-auto w-full max-w-[84rem] scroll-mt-24 px-4 py-[calc(var(--section-gap)/2)] sm:px-8"
    >
      <header className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-3xl"}>
        <TextEffect
          per="char"
          preset="fade"
          trigger="inView"
          speed={0.015}
          className="font-mono text-xs uppercase tracking-[0.32em] text-primary"
        >
          {eyebrow}
        </TextEffect>
        {typeof title === "string" ? (
          <TextEffect
            as="h2"
            per="word"
            trigger="inView"
            speed={0.05}
            className="mt-3 text-[clamp(2rem,5vw,3.1rem)] font-bold leading-[1.1]"
          >
            {title}
          </TextEffect>
        ) : (
          <motion.h2
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: false, margin: "0px 0px -12% 0px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-[clamp(2rem,5vw,3.1rem)] font-bold leading-[1.1]"
          >
            {title}
          </motion.h2>
        )}
        {lede ? (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "0px 0px -12% 0px" }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className={`ah-prose mt-4 text-lg leading-relaxed text-muted-foreground ${align === "center" ? "md:text-center" : ""}`}
          >
            {lede}
          </motion.p>
        ) : null}
      </header>
      <div className="mt-9 sm:mt-10">{children}</div>
    </section>
  );
}

/** Small "not decided yet" chip — used instead of inventing details. */
export function TbcBadge({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-dashed border-primary/50 bg-primary/10 px-2.5 py-0.5 font-mono text-xs uppercase tracking-[0.18em] text-primary ${className ?? ""}`}
    >
      <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
      To be confirmed
    </span>
  );
}
