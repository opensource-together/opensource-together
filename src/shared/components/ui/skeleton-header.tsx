import { Skeleton } from "./skeleton";

export function SkeletonUserDropdown() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-10 w-[141.5px] rounded-full" />
      <Skeleton className="size-10 rounded-full" />
    </div>
  );
}
