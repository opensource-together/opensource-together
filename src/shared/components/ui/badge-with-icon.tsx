import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { HiMinusCircle } from "react-icons/hi";
import { HiCheckCircle, HiXCircle } from "react-icons/hi2";

import { cn } from "@/shared/lib/utils";

const badgeWithIconVariants = cva(
  "inline-flex items-center text-sm pl-1 pr-2 h-5.5 justify-center font-medium tracking-tighter rounded-full border w-fit whitespace-nowrap shrink-0 gap-1 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        success:
          "border-transparent text-success bg-success/10 [a&]:hover:bg-success/20",
        info: "border-transparent text-ost-blue-three bg-ost-blue-three/10 [a&]:hover:bg-ost-blue-three/20",
        danger:
          "border-transparent text-destructive bg-destructive/10 [a&]:hover:bg-destructive/20",
        default:
          "border-transparent text-muted-foreground bg-muted-foreground/10 [a&]:hover:bg-muted-foreground/20",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

interface BadgeWithIconProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeWithIconVariants> {
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  iconSize?: string;
}

function BadgeWithIcon({
  className,
  variant = "info",
  children,
  icon,
  iconSize = "size-3",
  ...props
}: BadgeWithIconProps) {
  const getIcon = () => {
    if (icon) return icon;

    switch (variant) {
      case "success":
        return HiCheckCircle;
      case "danger":
        return HiXCircle;
      case "info":
      default:
        return HiMinusCircle;
    }
  };

  const Icon = getIcon();

  return (
    <span
      data-slot="badge-with-icon"
      className={cn(badgeWithIconVariants({ variant }), className)}
      {...props}
    >
      <Icon className={iconSize} />
      {children}
    </span>
  );
}

export { BadgeWithIcon, badgeWithIconVariants };
