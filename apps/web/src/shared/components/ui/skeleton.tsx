import { cn } from "@/shared/lib/utils";

/**
 * Renders a placeholder div with a pulsing animation, typically used to indicate loading content.
 *
 * Additional props are spread onto the underlying div element.
 *
 * @param className - Optional additional class names to apply to the skeleton div
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  );
}

export { Skeleton };
