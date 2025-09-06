import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { HiMinusCircle } from "react-icons/hi";
import { HiCheckCircle, HiXCircle } from "react-icons/hi2";

import { cn } from "@/shared/lib/utils";

const badgeWithIconVariants = cva(
  "inline-flex items-center justify-center font-medium tracking-tighter rounded-full border pl-0.5 pr-1.5 h-5 text-[10px] w-fit whitespace-nowrap shrink-0 gap-1.5 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        success:
          "border-transparent text-success bg-success/10 [a&]:hover:bg-success/20",
        info: "border-transparent text-ost-blue-three bg-ost-blue-three/10 [a&]:hover:bg-ost-blue-three/20",
        danger:
          "border-transparent text-destructive bg-destructive/10 [a&]:hover:bg-destructive/20",
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
}

function BadgeWithIcon({
  className,
  variant = "info",
  children,
  ...props
}: BadgeWithIconProps) {
  const getIcon = () => {
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
      <Icon className="size-4" />
      {children}
    </span>
  );
}

export { BadgeWithIcon, badgeWithIconVariants };
