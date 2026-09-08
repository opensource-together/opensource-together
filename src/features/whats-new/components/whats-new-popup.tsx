"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HiArrowUpRight, HiXMark } from "react-icons/hi2";
import { Button } from "@/shared/components/ui/button";
import {
  badgeItemAppearAnimate,
  badgeItemAppearInitial,
  badgeItemAppearTransition,
  badgeItemExit,
} from "@/shared/lib/motion/badge-item-appear";
import { useCurrentWeek, useWeeklyRecap } from "../hooks/use-weekly-recap";
import {
  hasSeenWeek,
  markWeekSeen,
  subscribeToSeenWeek,
} from "../lib/recap-storage";
import { RecapBanner } from "./recap-banner";

export function WhatsNewPopup() {
  const pathname = usePathname();
  const week = useCurrentWeek();
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [seen, setSeen] = useState(true);
  // Discovery is the right moment for this invitation; keep forms and readers quiet.
  const eligible = pathname === "/";
  const recap = useWeeklyRecap(week, eligible && !seen);

  useEffect(() => {
    if (!week) return;
    const update = () => setSeen(hasSeenWeek(week.id));
    update();
    return subscribeToSeenWeek(update);
  }, [week]);

  useEffect(() => {
    setReady(false);
    if (!eligible) return;
    const timer = window.setTimeout(() => setReady(true), 1800);
    return () => window.clearTimeout(timer);
  }, [eligible]);

  const visible =
    eligible &&
    ready &&
    !seen &&
    week &&
    recap.isSuccess &&
    recap.data.length > 0;
  const dismiss = () => {
    if (week) markWeekSeen(week.id);
  };

  useEffect(() => {
    if (!visible || !week) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") markWeekSeen(week.id);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible, week]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          key={week.id}
          aria-label="What's new this week"
          initial={reducedMotion ? { opacity: 0 } : badgeItemAppearInitial}
          animate={reducedMotion ? { opacity: 1 } : badgeItemAppearAnimate}
          exit={reducedMotion ? { opacity: 0 } : badgeItemExit}
          transition={
            reducedMotion ? { duration: 0 } : badgeItemAppearTransition
          }
          className="fixed right-4 bottom-4 z-40 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-87.5 overflow-y-auto rounded-[22px] border border-muted-black-stroke bg-card shadow-xl md:right-6 md:bottom-6"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={dismiss}
            aria-label="Dismiss this week's recap"
            className="absolute top-2 right-2 z-10 size-8 text-muted-foreground"
          >
            <HiXMark className="size-5" />
          </Button>
          <Link
            href="/whats-new"
            onClick={dismiss}
            className="group block focus-visible:outline-2 focus-visible:outline-ost-blue-two focus-visible:-outline-offset-4"
          >
            <RecapBanner compact />
            <div className="border-muted-black-stroke border-t p-6">
              <p className="mb-2 font-mono text-muted-foreground text-xs uppercase tracking-wider">
                {week.label}
              </p>
              <h2 className="font-medium text-lg tracking-tight">
                {recap.data.length} new{" "}
                {recap.data.length === 1 ? "repo" : "repos"} to explore.
              </h2>
              <p className="mt-2 line-clamp-2 text-muted-foreground text-sm leading-relaxed">
                {recap.data
                  .slice(0, 3)
                  .map((project) => project.title)
                  .join(", ")}
                {recap.data.length > 3 ? ", and more." : "."}
              </p>
              <span className="mt-5 flex items-center gap-2 font-medium text-foreground text-sm">
                Read the brief{" "}
                <HiArrowUpRight className="size-4 transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" />
              </span>
            </div>
          </Link>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
