"use client";

import { motion } from "motion/react";

import HeroBadge from "@/shared/components/ui/hero-badge";
import { EXTERNAL_LINKS } from "@/shared/lib/constants";

import type { ProjectFilters } from "../types/project-filters.type";
import FilterSearchBar from "./filter-search-bar.component";

const ease = [0.22, 1, 0.32, 1] as const;

/** Every element uses the same blur-up reveal */
const DURATION = 0.5;
/** Gap between each element starting */
const STAGGER = 0.11;

const variants = {
  hidden: { opacity: 0, filter: "blur(10px)", y: 6 },
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
      {/* 1 — badge */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={variants}
        transition={{ duration: DURATION, delay: 0, ease }}
      >
        <HeroBadge
          className="mb-3"
          pillLabel="GitHub"
          description="Help support the founding team"
          href={EXTERNAL_LINKS.GITHUB_REPO}
        />
      </motion.div>

      {/* 2 + 3 — headline lines */}
      <h1
        className="mt-3 text-center text-4xl leading-none tracking-[-0.04em] md:text-5xl"
        style={{ fontFamily: "Aspekta", fontWeight: 500 }}
      >
        <motion.span
          className="block"
          initial="hidden"
          animate="visible"
          variants={variants}
          transition={{ duration: DURATION, delay: STAGGER, ease }}
        >
          Together, build our
        </motion.span>
        <motion.span
          className="block"
          initial="hidden"
          animate="visible"
          variants={variants}
          transition={{ duration: DURATION, delay: STAGGER * 2, ease }}
        >
          future in open source
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
          Empowering open source initiatives through effortless project
          discovery, collaboration, and contributor connection.
        </p>
      </motion.div>

      {/* 5 — filter bar */}
      <motion.div
        className="mt-8 w-full px-6 md:w-auto"
        initial="hidden"
        animate="visible"
        variants={variants}
        transition={{ duration: DURATION, delay: STAGGER * 4, ease }}
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
