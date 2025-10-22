"use client";

import { Badge } from "@/shared/components/ui/badge";

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
}

export function CategoryList({
  title,
  categories,
  emptyText,
  className,
  dense = false,
}: CategoryListProps) {
  return (
    <div className={className}>
      {title && <h2 className="mb-3 text-sm">{title}</h2>}
      {categories?.length ? (
        <div
          className={dense ? "flex flex-wrap gap-1" : "flex flex-wrap gap-2"}
        >
          {categories.map((category, index) => (
            <Badge
              variant="gray"
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
