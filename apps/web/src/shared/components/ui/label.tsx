"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import * as React from "react";

import { cn } from "@/shared/lib/utils";

import { Tooltip } from "./tooltip";

interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
  required?: boolean;
  tooltip?: string;
}

function Label({
  className,
  required = false,
  children,
  tooltip,
  ...props
}: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium tracking-tighter select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="-ml-1 text-black/50">*</span>}
      {tooltip && (
        <span className="-ml-1">
          <Tooltip content={tooltip} />
        </span>
      )}
    </LabelPrimitive.Root>
  );
}

export { Label };
