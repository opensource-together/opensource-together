"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar } from "@/shared/components/ui/avatar";
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

const MAX_LOGOS = 4;

function formatNames(names: string[]) {
  if (names.length <= 2) return names.join(" and ");
  const rest = names.length - 2;
  return `${names.slice(0, 2).join(", ")} and ${rest} ${rest === 1 ? "other" : "others"}`;
}

export function WhatsNewPopup() {
  const pathname = usePathname();
  const week = useCurrentWeek();
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [seen, setSeen] = useState(true);
  // Discovery is the right moment for this invitation; keep forms and readers quiet.
  const eligible = pathname === "/";
  const recap = useWeeklyRecap(week, eligible && !seen);
  const projects = recap.data ?? [];

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
    projects.length > 0;
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
          className="fixed right-4 bottom-4 z-40 w-[calc(100%-2rem)] max-w-80 rounded-2xl border border-muted-black-stroke bg-card p-1.5 shadow-lg md:right-6 md:bottom-6"
        >
          <div className="relative isolate h-32 overflow-hidden rounded-[10px] border border-muted-black-stroke bg-card">
            <Image
              src="/illustrations/lord-mobile.png"
              alt=""
              width={480}
              height={406}
              sizes="240px"
              quality={85}
              className="absolute -top-10 right-0 -z-10 h-auto w-60 -scale-x-100 brightness-75 contrast-200"
            />
            <div className="flex h-full flex-col justify-center px-4 pb-3">
              <span className="text-muted-foreground text-xs italic leading-none">
                The
              </span>
              <h2
                className="mt-1 text-xl leading-[0.95] tracking-tighter"
                style={{ fontFamily: "Aspekta", fontWeight: 500 }}
              >
                Open Source
                <br />
                Brief
              </h2>
              <span className="mt-1 text-[10px] text-muted-foreground tabular-nums">
                {week.label}
              </span>
            </div>
          </div>
          <div className="px-2.5 pb-2.5">
            <div className="relative -mt-3.5 flex items-end justify-between gap-3">
              <div className="flex -space-x-1" aria-hidden>
                {projects.slice(0, MAX_LOGOS).map((project) => (
                  <Avatar
                    key={project.id || project.publicId}
                    src={project.logoUrl}
                    name={project.title}
                    size="xs"
                    shape="sharp"
                    className="size-7 rounded-md bg-card ring-2 ring-card"
                  />
                ))}
                {projects.length > MAX_LOGOS && (
                  <span className="relative flex size-7 items-center justify-center rounded-md bg-secondary font-medium text-[10px] text-muted-foreground ring-2 ring-card">
                    +{projects.length - MAX_LOGOS}
                  </span>
                )}
              </div>
            </div>
            <p className="mt-3">
              <span className="font-medium text-base text-foreground">
                {projects.length} new{" "}
                {projects.length === 1 ? "project" : "projects"} this week.
              </span>{" "}
            </p>
            <span className="text-muted-foreground text-sm">
              {formatNames(projects.map((project) => project.title))} just
              joined OST.
            </span>
            <div className="mt-4 flex items-center gap-2">
              <Button asChild size="sm">
                <Link href="/whats-new" onClick={dismiss}>
                  Read the brief
                </Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={dismiss}
                className="text-muted-foreground"
              >
                Not now
              </Button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
