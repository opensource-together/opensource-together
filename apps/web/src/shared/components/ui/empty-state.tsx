"use client";

import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
  width?: string;
}

export function EmptyState({
  title,
  description,
  action,
  className = "",
  width = "w-[400px]",
}: EmptyStateProps) {
  return (
    <div
      className={`mx-auto flex flex-col items-center justify-center py-12 text-center ${width} ${className}`}
    >
      <h3 className="mb-3 text-lg">{title}</h3>
      <p className="mb-6 tracking-tighter text-black/70">{description}</p>
      {action && (
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">{action}</div>
      )}
    </div>
  );
}
