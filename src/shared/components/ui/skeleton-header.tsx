import { Skeleton } from "./skeleton";

export function SkeletonNotificationPanel() {
  return (
    <div className="flex items-center">
      <Skeleton className="size-6 rounded-full" />
    </div>
  );
}

export function SkeletonUserDropdown() {
  return (
    <div className="flex items-center">
      <Skeleton className="size-10 rounded-full" />
    </div>
  );
}
