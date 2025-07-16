import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Metadata } from "next";

import { getQueryClient } from "@/shared/lib/query-client";

import { getProjectDetails } from "@/features/projects/services/project.service";
import ProjectDetailView from "@/features/projects/views/project-detail.view";

type Props = {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { projectId } = await params;
  const project = await getProjectDetails(projectId);

  return {
    title: `${project.title} | OpenSource Together`,
    description: project.shortDescription,
    openGraph: {
      title: `${project.title} | OpenSource Together`,
      description: project.shortDescription,
      images: [project.image || ""],
      url: `https://opensourcetogether.com/projects/${projectId}`,
      type: "website",
      siteName: "OpenSource Together",
      locale: "fr_FR",
      countryName: "France",
      emails: ["contact@opensourcetogether.com"],
    },
  };
}

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
