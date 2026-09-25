import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp } from "lucide-react";

/**
 * Floating "back to top" control. Appears once the visitor has scrolled past
 * roughly the hero, hides again near the top.
 */
export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y =
        window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      setShow(y > 400);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {show ? (
        <motion.button
          type="button"
          key="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -3 }}
          className="ah-magnetic fixed bottom-5 right-5 z-[70] inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/40 bg-primary text-primary-foreground shadow-[var(--glow-primary)] sm:bottom-7 sm:right-7 sm:h-12 sm:w-12"
        >
          <ArrowUp aria-hidden="true" strokeWidth={2} className="h-5 w-5" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
