import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";

import CTAFooter from "@/shared/components/layout/cta-footer";
import { getQueryClient } from "@/shared/lib/query-client";

import {
  ProjectQueryParams,
  getProjects,
} from "@/features/projects/services/project.service";
import HomepageViews from "@/features/projects/views/homepage.view";

export default async function HomePage() {
  const queryClient = getQueryClient();

  const defaultQueryParams: ProjectQueryParams = {
    page: 1,
    per_page: 50,
    orderBy: "createdAt",
    orderDirection: "desc",
  };

  await queryClient.prefetchQuery({
    queryKey: ["projects", defaultQueryParams],
    queryFn: () => getProjects(defaultQueryParams),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense>
        <HomepageViews />
      </Suspense>
      <CTAFooter imageIllustration="/illustrations/king.png" />
    </HydrationBoundary>
  );
}
