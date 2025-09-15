import * as React from "react";

import { cn } from "@/shared/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 text-primary flex field-sizing-content min-h-16 w-full rounded-md border border-black/5 bg-[#F9FAFB] px-3 py-2 text-sm leading-loose shadow-xs transition-[color,box-shadow] outline-none placeholder:text-neutral-500 focus-visible:ring-[1px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
