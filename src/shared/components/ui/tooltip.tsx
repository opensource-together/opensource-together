"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import type * as React from "react";
import { HiInformationCircle } from "react-icons/hi";

import { cn } from "@/shared/lib/utils";

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function TooltipRoot({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      className={cn("rounded-full", className)}
      {...props}
    />
  );
}

const tooltipVariants = cva(
  "fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 animate-in overflow-hidden rounded-md px-3 py-1.5 text-sm data-[state=closed]:animate-out",
  {
    variants: {
      variant: {
        light:
          "border border-border bg-background text-foreground shadow-black/5 shadow-md",
        dark: "bg-zinc-950 text-white shadow-black/5 shadow-md dark:border dark:border-border dark:bg-zinc-300 dark:text-black",
      },
    },
    defaultVariants: {
      variant: "light",
    },
  }
);

function TooltipContent({
  className,
  sideOffset = 4,
  variant,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> &
  VariantProps<typeof tooltipVariants>) {
  return (
    <TooltipPrimitive.Content
      data-slot="tooltip-content"
      sideOffset={sideOffset}
      className={cn(
        tooltipVariants({ variant }),
        "max-w-xs text-black/70",
        className
      )}
      {...props}
    />
  );
}

interface TooltipProps {
  content: string;
  variant?: "light" | "dark";
  side?: "top" | "right" | "bottom" | "left";
  delayDuration?: number;
}

function Tooltip({
  content,
  variant = "light",
  side = "top",
  delayDuration = 0,
}: TooltipProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipTrigger asChild>
          <HiInformationCircle className="size-6 rounded-full p-1 text-black/70 transition-colors duration-200 hover:bg-gray-50" />
        </TooltipTrigger>
        <TooltipContent variant={variant} side={side}>
          <p>{content}</p>
        </TooltipContent>
      </TooltipPrimitive.Root>
    </TooltipProvider>
  );
}

export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
};
