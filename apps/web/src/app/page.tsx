import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { getQueryClient } from "@/shared/lib/query-client";

import { getProjects } from "@/features/projects/services/project.service";
import HomepageViews from "@/features/projects/views/homepage.view";

/**
 * Asynchronously prefetches project data and renders the homepage within a hydration boundary for React Query.
 *
 * Ensures that project data is available for client-side hydration, improving initial load performance and user experience.
 */
export default async function HomePage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <HomepageViews />
    </HydrationBoundary>
  );
}
