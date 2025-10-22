"use client";

import { motion } from "motion/react";

type FadeUpType = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

export function FadeUp({ children, delay = 0, className }: FadeUpType) {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
