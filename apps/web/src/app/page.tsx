import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/queryClient";

import { getProjects } from "@/features/projects/services/projectAPI";
import HomepageViews from "@/features/projects/views/HomepageViews";

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
