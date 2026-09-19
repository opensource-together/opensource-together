"use client";

import { motion } from "motion/react";

import HeroBadge from "@/shared/components/ui/hero-badge";

const ease = [0.22, 1, 0.32, 1] as const;

const DURATION = 0.5;
const STAGGER = 0.11;

const variants = {
  hidden: { opacity: 0, filter: "blur(10px)", y: 6 },
  visible: { opacity: 1, filter: "blur(0px)", y: 0 },
};

export function LearnHeroIntro() {
  return (
    <>
      {/* 1 — badge */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={variants}
        transition={{ duration: DURATION, delay: 0, ease }}
      >
        <HeroBadge className="mb-3" />
      </motion.div>

      <div className="mx-6">
        <h1
          className="mt-3 text-center text-4xl leading-none tracking-[-0.04em] md:text-5xl"
          style={{ fontFamily: "Aspekta", fontWeight: 500 }}
        >
          {/* 2 — headline line 1 */}
          <motion.span
            className="block"
            initial="hidden"
            animate="visible"
            variants={variants}
            transition={{ duration: DURATION, delay: STAGGER, ease }}
          >
            Your open source
          </motion.span>
          {/* 3 — headline line 2 */}
          <motion.span
            className="block"
            initial="hidden"
            animate="visible"
            variants={variants}
            transition={{ duration: DURATION, delay: STAGGER * 2, ease }}
          >
            journey starts here
          </motion.span>
        </h1>

        {/* 4 — subtitle */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants}
          transition={{ duration: DURATION, delay: STAGGER * 3, ease }}
        >
          <p className="mt-5 max-w-[450px] px-2 text-center text-neutral-950 text-sm">
            Structured learning paths designed to take you from curious beginner
            to confident contributor, one concept at a time.
          </p>
        </motion.div>
      </div>
    </>
  );
}
