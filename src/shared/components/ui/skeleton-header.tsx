import { Skeleton } from "./skeleton";

export function SkeletonBreadcrumb() {
  return (
    <nav className="flex items-center space-x-1 text-sm">
      <Skeleton className="h-4 w-16" />
      <div className="flex items-center">
        <div className="bg-muted mx-2 h-3 w-3 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    </nav>
  );
}

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
