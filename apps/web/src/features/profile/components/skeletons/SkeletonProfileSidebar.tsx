import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonProfileSidebar() {
  return (
    <div className="w-full lg:w-[300px]">
      {/* Socials Section */}
      <div className="mb-6">
        <Skeleton className="mb-4 h-6 w-24" />
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <Skeleton className="size-5" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div>
        <Skeleton className="mb-4 h-6 w-24" />
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <Skeleton className="size-5" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
