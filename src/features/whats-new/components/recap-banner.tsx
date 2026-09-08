"use client";

import { useReducedMotion } from "motion/react";
import Image from "next/image";
import { FadeIn } from "@/shared/components/motion/fade-in";
import { FadeUp } from "@/shared/components/motion/fade-up";
import { cn } from "@/shared/lib/utils";

export function RecapBanner({ compact = false }: { compact?: boolean }) {
  const reducedMotion = useReducedMotion();
  const Reveal = reducedMotion ? "div" : FadeUp;
  const ImageReveal = reducedMotion ? "div" : FadeIn;

  return (
    <div className="relative">
      <div
        className={cn(
          "relative isolate overflow-hidden bg-secondary/60",
          compact
            ? "h-44"
            : "flex min-h-80 items-center justify-center sm:min-h-105"
        )}
      >
        <ImageReveal className="pointer-events-none absolute inset-0 -z-10 rounded-2xl border">
          <Image
            src="/illustrations/lord.png"
            alt=""
            fill
            priority={!compact}
            sizes={compact ? "350px" : "(max-width: 1024px) 100vw, 900px"}
            className={cn(
              "rounded-2xl object-cover",
              compact ? "object-left" : "hidden object-center sm:block"
            )}
          />
          {!compact && (
            <Image
              src="/illustrations/lord-mobile.png"
              alt=""
              fill
              sizes="100vw"
              className="rounded-2xl object-cover sm:hidden"
            />
          )}
        </ImageReveal>
        <Reveal
          className={cn(
            "relative text-center",
            compact
              ? "flex h-full flex-col items-center justify-center px-8"
              : "px-6 py-12"
          )}
        >
          <p
            className={cn(
              "mb-1 text-muted-foreground italic",
              compact ? "text-lg" : "text-2xl sm:text-4xl"
            )}
          >
            The
          </p>
          {compact ? (
            <p
              className="text-4xl leading-none tracking-tighter"
              style={{ fontFamily: "Aspekta", fontWeight: 500 }}
            >
              Open Source Brief
            </p>
          ) : (
            <h1
              className="text-5xl leading-none tracking-tighter sm:text-7xl"
              style={{ fontFamily: "Aspekta", fontWeight: 500 }}
            >
              Open Source
              <br className="sm:hidden" /> Brief
            </h1>
          )}
        </Reveal>
      </div>

    </div>
  );
}
