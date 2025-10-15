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
              "text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2",
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
            "file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input text-primary placeholder:text-muted-foreground flex h-10 w-full min-w-0 rounded-md border bg-white py-1 text-sm transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
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
