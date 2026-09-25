import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun, X } from "lucide-react";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "afterhours-theme";
export const THEME_HINT_KEY = "hasSeenThemeHint";

/**
 * Inlined in the document head so the correct theme is on <html> before paint.
 * Remembers the visitor's choice; dark is the default.
 */
export const themeBootstrapScript = `(function(){try{var k="${THEME_STORAGE_KEY}";var s=localStorage.getItem(k);var t=s==="light"?"light":"dark";document.documentElement.classList.toggle("dark",t==="dark");}catch(e){document.documentElement.classList.add("dark");}})();`;

function applyTheme(theme: Theme) {
  // `color-scheme` lives in CSS (:root / .dark) so hydration sees identical markup.
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    // Dark is the site default; only an explicit stored choice switches it.
    const initial: Theme = stored === "light" ? "light" : "dark";
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        /* storage unavailable — theme still applies for this session */
      }
      return next;
    });
  }, []);

  return { theme, toggle, mounted };
}

/** First-visit nudge pointing at the theme toggle. Shows once, ever. */
function useThemeHint() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let seen = true;
    try {
      seen = localStorage.getItem(THEME_HINT_KEY) === "1";
    } catch {
      seen = true;
    }
    if (seen) return;
    // A beat after load, so it doesn't fight the hero's entrance.
    const t = window.setTimeout(() => setOpen(true), 2600);
    return () => window.clearTimeout(t);
  }, []);

  const dismiss = useCallback(() => {
    setOpen(false);
    try {
      localStorage.setItem(THEME_HINT_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  return { open, dismiss };
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle, mounted } = useTheme();
  const { open, dismiss } = useThemeHint();
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) dismiss();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("pointerdown", onDown as EventListener);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown as EventListener);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, dismiss]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => {
          dismiss();
          toggle();
        }}
        aria-label={
          mounted ? `Switch to ${theme === "dark" ? "light" : "dark"} theme` : "Switch colour theme"
        }
        aria-pressed={mounted ? theme === "dark" : undefined}
        className={`ah-magnetic relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface/70 text-foreground transition-colors hover:border-primary/50 hover:text-primary ${className ?? ""}`}
      >
        <Sun
          aria-hidden="true"
          className="h-[18px] w-[18px] rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0"
        />
        <Moon
          aria-hidden="true"
          className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100"
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-[calc(100%+0.6rem)] z-[80] w-max max-w-[13rem] rounded-lg border border-primary/40 bg-popover px-3 py-2.5 text-left shadow-[var(--glow-primary)]"
          >
            <span
              aria-hidden="true"
              className="absolute -top-1.5 right-3.5 h-3 w-3 rotate-45 border-l border-t border-primary/40 bg-popover"
            />
            <div className="relative flex items-start gap-2">
              <p className="text-xs leading-snug text-foreground">
                Light or dark — your call.
              </p>
              <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss"
                className="-mr-1 -mt-0.5 shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
