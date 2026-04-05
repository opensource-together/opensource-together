import { cn } from "@/shared/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-[skeleton-zinc-pulse_2s_ease-in-out_infinite] rounded-md",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
