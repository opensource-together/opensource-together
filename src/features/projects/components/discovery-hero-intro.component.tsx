"use client";

import { motion } from "motion/react";

import HeroBadge from "@/shared/components/ui/hero-badge";

import type { ProjectFilters } from "../types/project-filters.type";
import FilterSearchBar from "./filter-search-bar.component";

/** Smooth deceleration (flat transition + tuple ease — reliable with motion/react variants) */
const ease = [0.22, 1, 0.32, 1] as const;

/** One headline line; second line starts when this block finishes */
const LINE_DURATION = 0.68;
/** Start badge / subtitle / filter shortly after the headline lines (tight buffer) */
const REST_DELAY = LINE_DURATION * 2 + 0.02;

const subtleBlurHidden = "blur(4px)";

const lineVariants = {
  hidden: { opacity: 0, filter: subtleBlurHidden, y: 4 },
  visible: { opacity: 1, filter: "blur(0px)", y: 0 },
};

const fromTopVariants = {
  hidden: { opacity: 0, filter: subtleBlurHidden, y: -8 },
  visible: { opacity: 1, filter: "blur(0px)", y: 0 },
};

interface DiscoveryHeroIntroProps {
  onFilterChange?: (filters: ProjectFilters) => void;
  isLoading?: boolean;
  initialFilters?: ProjectFilters;
}

export function DiscoveryHeroIntro({
  onFilterChange,
  isLoading,
  initialFilters,
}: DiscoveryHeroIntroProps) {
  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fromTopVariants}
        transition={{ duration: 0.72, delay: REST_DELAY, ease }}
      >
        <HeroBadge className="mb-3" />
      </motion.div>

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
          Together, build our
        </motion.span>
        <motion.span
          className="block"
          initial="hidden"
          animate="visible"
          variants={lineVariants}
          transition={{
            duration: LINE_DURATION,
            delay: LINE_DURATION,
            ease,
          }}
        >
          future in open source
        </motion.span>
      </h1>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fromTopVariants}
        transition={{ duration: 0.72, delay: REST_DELAY + 0.04, ease }}
      >
        <p className="mt-5 max-w-[450px] px-2 text-center text-neutral-950 text-sm">
          Empowering open source initiatives through effortless project
          discovery, collaboration, and contributor connection.
        </p>
      </motion.div>

      <motion.div
        className="mt-8 w-full px-6 md:w-auto"
        initial="hidden"
        animate="visible"
        variants={fromTopVariants}
        transition={{ duration: 0.72, delay: REST_DELAY + 0.1, ease }}
      >
        <FilterSearchBar
          onFilterChange={onFilterChange}
          isLoading={isLoading}
          initialFilters={initialFilters}
        />
      </motion.div>
    </>
  );
}
