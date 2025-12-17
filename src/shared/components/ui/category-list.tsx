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
        <p className="text-black/50 text-sm">{emptyText}</p>
      ) : null}
    </div>
  );
}
