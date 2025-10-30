"use client";

import { ReactNode } from "react";

import Icon, { IconName } from "@/shared/components/ui/icon";
import { Separator } from "@/shared/components/ui/separator";

type StatItem = {
  icon: string;
  label: string;
  value: ReactNode;
  iconSize?: "xs" | "sm" | "md";
};

interface StatsListProps {
  title?: string;
  items: StatItem[];
  className?: string;
}

export function StatsList({ title, items, className }: StatsListProps) {
  return (
    <div className={className}>
      {title && <h2 className="mb-4 text-sm">{title}</h2>}
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <Icon
              name={item.icon as IconName}
              size={item.iconSize || "xs"}
              variant="black"
              className="opacity-50"
            />
            <span className="text-muted-foreground text-sm font-normal">
              {item.label}
            </span>
          </div>
          <div className="mx-4 flex flex-1 items-center">
            <Separator />
          </div>
          <span className="text-primary text-sm font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
