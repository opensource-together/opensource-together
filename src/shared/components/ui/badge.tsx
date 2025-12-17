import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/shared/lib/utils";

const badgeVariants = cva(
  "inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full border px-2 font-medium text-xs tracking-tighter transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        info: "border-transparent bg-ost-blue-one/10 text-ost-blue-three",
        danger:
          "border-transparent bg-[#FEF9C280] text-[#FDC700] [a&]:hover:bg-[#FEF9C280]/90",
        success:
          "border-transparent bg-[#D0FAE580] text-[#00D492] [a&]:hover:bg-[#D0FAE580]/90",
        gray: "border-transparent bg-accent text-muted-foreground [a&]:hover:bg-accent/90",
        indigo:
          "border-transparent bg-[#E0E7FF80] text-[#7C86FF] [a&]:hover:bg-[#E0E7FF80]/90",
        white:
          "border border-muted-black-stroke bg-white text-foreground [a&]:hover:bg-white/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
