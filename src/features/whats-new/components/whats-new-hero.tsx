"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import type { ReactNode } from "react";

import HeroBadge from "@/shared/components/ui/hero-badge";

const ease = [0.22, 1, 0.32, 1] as const;

const DURATION = 0.5;
const STAGGER = 0.11;

const variants = {
  hidden: { opacity: 0, filter: "blur(10px)", y: 6 },
  visible: { opacity: 1, filter: "blur(0px)", y: 0 },
};

export function WhatsNewHero({ children }: { children?: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const reveal = (step: number) =>
    reducedMotion
      ? {}
      : {
          initial: "hidden",
          animate: "visible",
          variants,
          transition: { duration: DURATION, delay: STAGGER * step, ease },
        };

  return (
    <div className="relative mx-auto w-full pb-12 md:pb-16">
      <Image
        src="/illustrations/lord.png"
        alt=""
        width={1441}
        height={400}
        priority
        className="absolute -top-14 left-1/2 z-[-1] hidden -translate-x-1/2 object-contain md:block"
      />
      <Image
        src="/illustrations/lord-mobile.png"
        alt=""
        width={402}
        height={361}
        quality={100}
        className="absolute -top-20 left-1/2 z-[-1] h-auto w-full -translate-x-1/2 object-contain md:hidden"
      />
      <div className="relative z-10 mx-auto mt-4 flex w-full max-w-[1441px] flex-col items-center justify-center">
        <motion.div {...reveal(0)}>
          <HeroBadge
            className="mb-4"
            pillLabel="Weekly"
            description="Get your project in next week's brief"
            href="/projects/create"
            external={false}
          />
        </motion.div>

        <div className="mx-6 flex flex-col items-center">
          <h1
            className="mt-2 text-center text-5xl leading-none tracking-[-0.04em] md:text-6xl"
            style={{ fontFamily: "Aspekta", fontWeight: 500 }}
          >
            <motion.span
              className="block font-normal text-2xl text-muted-foreground italic tracking-tight md:text-2xl"
              {...reveal(1)}
            >
              The
            </motion.span>
            <motion.span className="mt-2 block" {...reveal(2)}>
              Open Source Brief
            </motion.span>
          </h1>

          <motion.div {...reveal(3)}>
            <p className="mt-7 max-w-[460px] px-2 text-center text-neutral-950 text-sm leading-relaxed">
              A little discovery goes a long way. Meet the projects joining our
              open source community this week.
            </p>
          </motion.div>

          {children && (
            <motion.div className="mt-10" {...reveal(4)}>
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
