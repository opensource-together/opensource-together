"use client";

import { ReactNode } from "react";

import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/lib/utils";

type StatItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: ReactNode;
  iconSize?: "xs" | "sm" | "md";
};

interface StatsListProps {
  title?: string;
  items: StatItem[];
  className?: string;
}

const iconSizeClasses = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
};

export function StatsList({ title, items, className }: StatsListProps) {
  return (
    <div className={className}>
      {title && <h2 className="mb-4 text-sm">{title}</h2>}
      {items.map((item, idx) => {
        const IconComponent = item.icon;
        const iconSize = item.iconSize || "sm";
        return (
          <div key={idx} className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <IconComponent
                className={cn(
                  "text-[muted-foreground] opacity-50",
                  iconSizeClasses[iconSize]
                )}
              />
              <span className="text-muted-foreground text-sm font-normal">
                {item.label}
              </span>
            </div>
            <div className="mx-4 flex flex-1 items-center">
              <Separator />
            </div>
            <span className="text-primary text-sm font-medium">
              {item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
