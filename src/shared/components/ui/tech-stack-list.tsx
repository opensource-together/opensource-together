"use client";

import { AnimatePresence, motion } from "motion/react";

import StackLogo from "@/shared/components/ui/stack-logo";
import {
  badgeItemAppearAnimate,
  badgeItemAppearInitial,
  badgeItemAppearTransition,
  badgeItemExit,
} from "@/shared/lib/motion/badge-item-appear";

type Tech = {
  id?: string;
  name: string;
  iconUrl?: string | null;
};

interface TechStackListProps {
  title?: string;
  techs: Tech[];
  emptyText?: string;
  className?: string;
}

export function TechStackList({
  title,
  techs,
  emptyText,
  className,
}: TechStackListProps) {
  return (
    <div className={className}>
      {title && <h2 className="mb-3 text-sm tracking-[-0.02em]">{title}</h2>}
      <div className="flex w-full flex-wrap gap-2.5 gap-y-2">
        <AnimatePresence mode="popLayout">
          {(techs ?? []).map((tech, index) => (
            <motion.span
              key={tech.id || `${tech.name}-${index}`}
              layout
              initial={badgeItemAppearInitial}
              animate={badgeItemAppearAnimate}
              exit={badgeItemExit}
              transition={badgeItemAppearTransition}
              className="inline-flex"
            >
              <StackLogo
                name={tech.name}
                icon={tech.iconUrl || "/icons/empty-project.svg"}
                alt={tech.name}
              />
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      {!techs?.length && emptyText ? (
        <p className="text-black/50 text-sm">{emptyText}</p>
      ) : null}
    </div>
  );
}
