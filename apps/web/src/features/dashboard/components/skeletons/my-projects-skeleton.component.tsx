import DashboardHeading from "@/features/dashboard/components/layout/dashboard-heading.component";

export default function MyProjectsSkeletonComponent() {
  return (
    <div>
      <DashboardHeading
        title="Mes projets"
        description="Gérez vos projets Open Source et vos candidatures reçues."
      />
      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:gap-8">
        {/* Section Mes Projets - Desktop */}
        <div className="order-1 hidden w-full min-w-0 lg:block lg:w-[35%]">
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 rounded-[20px] bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Candidatures & Équipe - Desktop */}
        <div className="order-2 hidden w-full min-w-0 lg:block lg:w-[65%]">
          <div className="sticky top-0 z-10">
            {/* Tabs skeleton */}
            <div className="flex border-b border-black/10 tracking-tighter">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="px-4 py-3">
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                </div>
              ))}
            </div>
            <div className="mt-6">
              <div className="overflow-hidden rounded-lg border border-black/10">
                <div className="space-y-4 p-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                        <div className="flex gap-2">
                          <div className="h-5 w-12 animate-pulse rounded-full bg-gray-200" />
                          <div className="h-5 w-12 animate-pulse rounded-full bg-gray-200" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile skeleton */}
        <div className="order-1 block w-full lg:hidden">
          <div className="mb-6 flex border-b border-gray-200">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex-1 py-3 text-center">
                <div className="mx-auto h-4 w-20 animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 rounded-[20px] bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
