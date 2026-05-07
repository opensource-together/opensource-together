"use client";

import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/shared/lib/utils";

interface FilterAnimatedValueProps {
  value: string;
  className?: string;
}

export function FilterAnimatedValue({
  value,
  className,
}: FilterAnimatedValueProps) {
  return (
    <div className="relative min-h-[20px] min-w-0">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={value}
          initial={{ opacity: 0, filter: "blur(6px)", x: -10 }}
          animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
          exit={{ opacity: 0, filter: "blur(6px)", x: 14 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className={cn("block truncate", className)}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
