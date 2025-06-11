import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonProfileHero() {
  return (
    <div className="my-10 h-auto w-full rounded-3xl border border-black/5 bg-white px-8 pb-10 shadow-xs sm:w-[488px] lg:w-[711.96px]">
      <div className="relative top-[-15px] flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative top-[-20px] mr-4">
            <Skeleton className="size-[120px] rounded-full" />
          </div>
          <div>
            <Skeleton className="mb-2 h-7 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex items-center justify-end space-x-3">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <div className="ml-4 flex-grow border-t border-dashed border-[black]/10" />
      </div>
      <Skeleton className="mb-6 h-16 w-full" />

      <div className="my-5 flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <div className="ml-4 flex-grow border-t border-dashed border-[black]/10" />
      </div>
      <div className="flex flex-wrap gap-2">
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} className="h-6 w-20" />
        ))}
      </div>

      <div className="my-5 flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <div className="ml-4 flex-grow border-t border-dashed border-[black]/10" />
      </div>
      <div className="flex flex-wrap gap-2">
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="h-6 w-20" />
        ))}
      </div>
    </div>
  );
}
