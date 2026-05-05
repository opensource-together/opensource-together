"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ComponentProps } from "react";

import { Badge } from "@/shared/components/ui/badge";
import {
  badgeItemAppearAnimate,
  badgeItemAppearInitial,
  badgeItemAppearTransition,
  badgeItemExit,
} from "@/shared/lib/motion/badge-item-appear";

import { Label } from "./label";

type Category = {
  id?: string;
  name: string;
};

interface CategoryListProps {
  title?: string;
  categories: Category[];
  emptyText?: string;
  className?: string;
  dense?: boolean;
  badgeVariant?: ComponentProps<typeof Badge>["variant"];
  badgeClassName?: string;
}

export function CategoryList({
  title,
  categories,
  emptyText,
  className,
  dense = false,
  badgeVariant = "gray",
  badgeClassName,
}: CategoryListProps) {
  return (
    <div className={className}>
      {title && <Label className="mb-3 text-sm tracking-tight">{title}</Label>}
      <div className={dense ? "flex flex-wrap gap-1" : "flex flex-wrap gap-2"}>
        <AnimatePresence mode="popLayout">
          {(categories ?? []).map((category, index) => (
            <motion.span
              key={category.id || `${category.name}-${index}`}
              layout
              initial={badgeItemAppearInitial}
              animate={badgeItemAppearAnimate}
              exit={badgeItemExit}
              transition={badgeItemAppearTransition}
              className="inline-flex"
            >
              <Badge variant={badgeVariant} className={badgeClassName}>
                {category.name}
              </Badge>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      {!categories?.length && emptyText ? (
        <p className="text-black/50 text-sm">{emptyText}</p>
      ) : null}
    </div>
  );
}
