import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import CTAFooter from "@/shared/components/layout/cta-footer";
import { getQueryClient } from "@/shared/lib/query-client";

import { getProjects } from "@/features/projects/services/project.service";
import HomepageViews from "@/features/projects/views/homepage.view";

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
      <CTAFooter imageIllustration="/illustrations/angel.png" />
    </HydrationBoundary>
  );
}
