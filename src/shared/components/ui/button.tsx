import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 origin-center cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-full font-medium text-sm tracking-tight outline-none transition-all hover:scale-[0.98] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground focus-visible:border-transparent focus-visible:ring-0",
        destructive: "bg-destructive/10 text-destructive",
        outline:
          "border bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "border bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:scale-100 hover:bg-accent active:scale-100",
        input:
          "rounded-md border border-input bg-background font-normal shadow-none hover:scale-100 active:scale-100",
        link: "text-primary underline-offset-4 hover:scale-100 hover:underline active:scale-100",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-4",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 px-6 has-[>svg]:px-4",
        icon: "size-8 rounded-full p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
