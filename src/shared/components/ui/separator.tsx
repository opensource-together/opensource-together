"use client";

import * as SeparatorPrimitive from "@radix-ui/react-separator";
import type * as React from "react";

import {
  separatorBleedPadding4ClassName,
  separatorBleedPadding6ClassName,
} from "@/shared/lib/separator-bleed";
import { cn } from "@/shared/lib/utils";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  /** Match parent horizontal padding so the rule spans edge-to-edge inside modals/sheets */
  contentPaddingX,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root> & {
  contentPaddingX?: 4 | 6;
}) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-black/5 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        !(contentPaddingX && orientation === "horizontal") &&
          "data-[orientation=horizontal]:w-full",
        contentPaddingX === 6 &&
          orientation === "horizontal" &&
          separatorBleedPadding6ClassName,
        contentPaddingX === 4 &&
          orientation === "horizontal" &&
          separatorBleedPadding4ClassName,
        className
      )}
      {...props}
    />
  );
}

export { Separator };
