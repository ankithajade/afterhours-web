import { useEffect, useState } from "react";

const KEY = "ah-intro-played";

/**
 * True when the full entrance sequence should play. It plays once per browser
 * session; a reload inside the same session lands directly on the settled
 * state. Clicking the wordmark calls resetIntro() to replay it deliberately.
 *
 * The returned value only scales durations/delays, never the rendered initial
 * markup, so SSR and hydration stay identical.
 */
export function useIntroPlay() {
  const [play] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      return !window.sessionStorage.getItem(KEY);
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      window.sessionStorage.setItem(KEY, "1");
    } catch {
      /* storage blocked — intro simply plays every load */
    }
  }, []);

  return play;
}

/** Clears the session flag so the next home render replays the intro. */
export function resetIntro() {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
