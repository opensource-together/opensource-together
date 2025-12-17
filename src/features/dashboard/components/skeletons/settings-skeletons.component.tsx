import { Skeleton } from "@/shared/components/ui/skeleton";

export function SettingsSkeleton() {
  return (
    <div>
      <div className="space-y-6">
        {/* Profile Section Skeleton */}
        <section>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <div className="mr-4">
                <Skeleton className="h-16 w-16 rounded-full" />
              </div>
              <div>
                <Skeleton className="mb-1 h-8 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
        </section>

        {/* Integrations Section Skeleton */}
        <section className="mt-10">
          <Skeleton className="mb-4 h-6 w-48" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-3xl border border-muted-black-stroke p-5 md:max-w-2/3"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-8 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </section>

        {/* Danger Zone Skeleton */}
        <section className="my-10">
          <Skeleton className="mb-2 h-6 w-32" />
          <Skeleton className="mb-6 h-4 w-96" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </section>
      </div>
    </div>
  );
}
