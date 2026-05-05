import { useEffect, useState } from "react";

/** Matches Tailwind animation duration on the panel */
export const INLINE_FILTER_PANEL_EXIT_MS = 200;

export const inlineFilterPanelEnterClass =
  "fade-in-0 zoom-in-95 slide-in-from-top-2 animate-in blur-in-[6px] duration-200 ease-out";

export const inlineFilterPanelExitClass =
  "fade-out-0 zoom-out-95 slide-out-to-top-2 animate-out blur-out-[6px] duration-200 ease-out";

/**
 * Keeps an inline filter panel mounted briefly after `open` becomes false so exit animations can run.
 */
export function useInlineFilterPanelPresence(
  open: boolean,
  exitDurationMs = INLINE_FILTER_PANEL_EXIT_MS
) {
  const [phase, setPhase] = useState<"closed" | "open" | "exiting">(() =>
    open ? "open" : "closed"
  );

  useEffect(() => {
    if (open) {
      setPhase("open");
      return;
    }
    setPhase((p) => (p === "open" ? "exiting" : p));
  }, [open]);

  useEffect(() => {
    if (phase !== "exiting") return;
    const t = window.setTimeout(() => {
      setPhase("closed");
    }, exitDurationMs);
    return () => window.clearTimeout(t);
  }, [phase, exitDurationMs]);

  const showPanel = phase !== "closed";
  const isExiting = phase === "exiting";

  return { showPanel, isExiting };
}
