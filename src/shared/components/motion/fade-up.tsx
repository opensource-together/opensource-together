"use client";

import { cubicBezier } from "motion";
import { motion } from "motion/react";

type FadeUpProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

const ease = cubicBezier(0.25, 0.1, 0.25, 1);

const variants = {
  hidden: { opacity: 0, filter: "blur(6px)", y: 20 },
  visible: { opacity: 1, filter: "blur(0)", y: 0 },
};

export function FadeUp({ children, delay = 0, className }: FadeUpProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      variants={variants}
      transition={{ duration: 0.8, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
