import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { getQueryClient } from "@/shared/lib/query-client";

import { getProjectDetails } from "@/features/projects/services/project.service";
import ProjectDetailView from "@/features/projects/views/project-detail.view";

/**
 * Asynchronously renders the project detail page with server-side data hydration.
 *
 * Awaits the provided `params` promise to obtain the `projectId`, prefetches project details, and returns a React component tree that hydrates and displays the project detail view.
 *
 * @param params - A promise resolving to an object containing the `projectId` to display
 * @returns A React element rendering the hydrated project detail view
 */
export default async function ProjectPage({
  params,
}: {
  params: Promise<{
    projectId: string;
  }>;
}) {
  const { projectId } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectDetails(projectId),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProjectDetailView projectId={projectId} />
    </HydrationBoundary>
  );
}
