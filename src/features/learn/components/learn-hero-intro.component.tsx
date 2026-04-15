"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { HiChevronRight } from "react-icons/hi2";

import { Button } from "@/shared/components/ui/button";
import HeroBadge from "@/shared/components/ui/hero-badge";

/** Match `DiscoveryHeroIntro` timing */
const ease = [0.22, 1, 0.32, 1] as const;
const LINE_DURATION = 0.56;
const LINE_STAGGER = 0.88;
const REST_DELAY = LINE_DURATION * (1 + LINE_STAGGER) - 0.06;

const subtleBlurHidden = "blur(4px)";

const lineVariants = {
  hidden: { opacity: 0, filter: subtleBlurHidden, y: 4 },
  visible: { opacity: 1, filter: "blur(0px)", y: 0 },
};

const fromTopVariants = {
  hidden: { opacity: 0, filter: subtleBlurHidden, y: -8 },
  visible: { opacity: 1, filter: "blur(0px)", y: 0 },
};

interface LearnHeroIntroProps {
  startLearningHref: string;
  startHandsOnHref: string;
}

export function LearnHeroIntro({
  startLearningHref,
  startHandsOnHref,
}: LearnHeroIntroProps) {
  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fromTopVariants}
        transition={{ duration: 0.6, delay: REST_DELAY, ease }}
      >
        <HeroBadge className="mb-3" />
      </motion.div>

      <div className="mx-6">
        <h1
          className="mt-3 text-center text-4xl leading-none tracking-[-0.04em] md:text-5xl"
          style={{ fontFamily: "Aspekta", fontWeight: 500 }}
        >
          <motion.span
            className="block"
            initial="hidden"
            animate="visible"
            variants={lineVariants}
            transition={{ duration: LINE_DURATION, ease }}
          >
            Learn and Practice
          </motion.span>
          <motion.span
            className="block"
            initial="hidden"
            animate="visible"
            variants={lineVariants}
            transition={{
              duration: LINE_DURATION,
              delay: LINE_DURATION * LINE_STAGGER,
              ease,
            }}
          >
            Open Source
          </motion.span>
        </h1>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fromTopVariants}
          transition={{ duration: 0.6, delay: REST_DELAY + 0.02, ease }}
        >
          <p className="mt-5 max-w-[450px] px-2 text-center text-neutral-950 text-sm">
            Learn about open source, prepare your project, and release it
            publicly with confidence.
          </p>
        </motion.div>

        <motion.div
          className="mt-8 flex flex-row justify-center gap-3"
          initial="hidden"
          animate="visible"
          variants={fromTopVariants}
          transition={{ duration: 0.6, delay: REST_DELAY + 0.06, ease }}
        >
          <Link href={startLearningHref}>
            <Button variant="default">
              Start Learning <HiChevronRight className="size-4" />
            </Button>
          </Link>
          <Link href={startHandsOnHref}>
            <Button variant="secondary">Start Hands-On</Button>
          </Link>
        </motion.div>
      </div>
    </>
  );
}
