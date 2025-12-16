"use client";

import * as React from "react";

import { cn } from "@/shared/lib/utils";

import Icon, { type IconName } from "./icon";

interface InputWithIconProps extends React.ComponentProps<"input"> {
  icon?: IconName;
  iconNode?: React.ReactNode;
  iconClassName?: string;
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ className, type, icon, iconNode, iconClassName, ...props }, ref) => {
    return (
      <div className="relative">
        {(icon || iconNode) && (
          <div
            className={cn(
              "pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground",
              iconClassName
            )}
          >
            {iconNode ? (
              iconNode
            ) : (
              <Icon name={icon as IconName} size="sm" variant="gray" />
            )}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          data-slot="input"
          className={cn(
            "flex h-10 w-full min-w-0 rounded-md border border-input bg-white py-1 text-primary text-sm outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
            "focus-visible:border-ring focus-visible:ring-[1px] focus-visible:ring-ring/50",
            "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
            icon || iconNode ? "pr-3 pl-10" : "px-3",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

InputWithIcon.displayName = "InputWithIcon";

export { InputWithIcon };
