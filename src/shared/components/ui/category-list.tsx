"use client";

import type { ComponentProps } from "react";

import { Badge } from "@/shared/components/ui/badge";

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
  showTooltip?: boolean;
  tooltipText?: string;
}

export function CategoryList({
  title,
  categories,
  emptyText,
  className,
  dense = false,
  badgeVariant = "gray",
  badgeClassName,
  showTooltip = false,
  tooltipText = "AI-suggested categories may not be perfectly accurate yet and will improve over time.",
}: CategoryListProps) {
  return (
    <div className={className}>
      {title && (
        <Label
          className="mb-3 text-sm tracking-tight"
          tooltip={showTooltip ? tooltipText : undefined}
        >
          {title}
        </Label>
      )}
      {categories?.length ? (
        <div
          className={dense ? "flex flex-wrap gap-1" : "flex flex-wrap gap-2"}
        >
          {categories.map((category, index) => (
            <Badge
              variant={badgeVariant}
              className={badgeClassName}
              key={category.id || `${category.name}-${index}`}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      ) : emptyText ? (
        <p className="text-sm text-black/50">{emptyText}</p>
      ) : null}
    </div>
  );
}
