import { Skeleton } from "@/shared/components/ui/skeleton";

interface SkeletonProfileHeroProps {
  hideHeader?: boolean;
}

export default function SkeletonProfileHero({
  hideHeader = false,
}: SkeletonProfileHeroProps) {
  if (hideHeader) {
    return <></>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-4">
            <Skeleton className="h-16 w-16 rounded-full" />
          </div>
          <div>
            <Skeleton className="mb-1 h-8 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="mt-4">
        <Skeleton className="mb-1 h-4 w-full" />
        <Skeleton className="mb-1 h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
    </div>
  );
}
