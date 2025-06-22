import { Skeleton } from "@/shared/components/ui/skeleton";

/**
 * Renders a skeleton placeholder for the project edit form layout.
 *
 * Displays static skeleton elements representing the structure of a project edit form, including form fields, technical stack inputs, sidebar sections, and action buttons. Intended for use as a loading state while the actual form data is being fetched.
 */
export default function SkeletonProjectEditForm() {
  return (
    <div className="mx-auto mt-4 max-w-[1300px] px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40">
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:gap-16">
        {/* Form Skeleton */}
        <div className="flex w-[710px] flex-col gap-4 rounded-3xl border border-black/5 bg-white p-10 shadow-[0_2px_5px_rgba(0,0,0,0.03)]">
          {/* Header with icon and title */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-[80px] w-[80px] rounded-sm" />
                <Skeleton className="h-8 w-48" /> {/* Title */}
              </div>
              <div className="flex cursor-pointer items-center gap-1.5">
                <Skeleton className="h-5 w-28" /> {/* Add Repository text */}
                <Skeleton className="h-5 w-4" /> {/* Plus icon */}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-4">
            <Skeleton className="mb-6 h-6 w-48" /> {/* Label */}
            <Skeleton className="h-[269px] w-[643px] rounded-lg" />{" "}
            {/* Textarea */}
          </div>

          {/* Divider */}
          <div className="mt-4 mb-2 w-full border-t border-dashed border-black/10" />

          {/* Technical Stack */}
          <div>
            <Skeleton className="mb-4 h-6 w-36" /> {/* Label */}
            {/* Tech stack inputs */}
            {[1, 2].map((i) => (
              <div key={i} className="mb-2 flex items-center gap-2">
                <Skeleton className="h-[38px] flex-1 rounded-lg" />
                <Skeleton className="h-[41px] w-[41px] rounded-sm" />
              </div>
            ))}
            {/* Add technology button */}
            <div className="mt-1 flex items-center gap-1.5">
              <Skeleton className="h-6 w-6 rounded-xs" />
              <Skeleton className="h-5 w-28" />
            </div>
          </div>

          {/* Submit button */}
          <Skeleton className="mt-4 h-[43px] w-[120px] self-end rounded-md" />
        </div>

        {/* Sidebar Skeleton */}
        <div className="flex w-[270px] flex-col gap-10">
          {/* Share Section */}
          <div>
            <Skeleton className="mb-3 h-6 w-24" />
            <div className="flex flex-col gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-[15px] w-[15px] rounded-sm" />
                  <Skeleton className="h-4 w-36" />
                </div>
              ))}
            </div>
          </div>

          {/* Community Stats Section */}
          <div>
            <Skeleton className="mb-3 h-6 w-40" />
            <div className="flex flex-col gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-[15px] w-[15px] rounded-sm" />
                  <Skeleton className="h-4 w-36" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
