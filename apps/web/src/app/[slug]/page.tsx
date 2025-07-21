import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getQueryClient } from "@/shared/lib/query-client";
import { getProjectBySlug } from "@/features/projects/services/project.service";
import ProjectDetailView from "@/features/projects/views/project-detail.view";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const project = await getProjectBySlug(slug);
    
    return {
      title: `${project.title} | OpenSource Together`,
      description: project.shortDescription,
      openGraph: {
        title: `${project.title} | OpenSource Together`,
        description: project.shortDescription,
        images: [project.image || ""],
        url: `https://opensourcetogether.com/${slug}`,
        type: "website",
        siteName: "OpenSource Together",
        locale: "fr_FR",
        countryName: "France",
        emails: ["contact@opensourcetogether.com"],
      },
    };
  } catch (error) {
    return {
      title: "Projet non trouvé | OpenSource Together",
      description: "Le projet demandé n'existe pas",
    };
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;

  const queryClient = getQueryClient();

  try {
    const project = await queryClient.fetchQuery({
      queryKey: ["project", "slug", slug],
      queryFn: () => getProjectBySlug(slug),
    });

    const dehydratedState = dehydrate(queryClient);

    return (
      <HydrationBoundary state={dehydratedState}>
        <ProjectDetailView projectId={project.id} />
      </HydrationBoundary>
    );
  } catch (error) {
    notFound();
  }
}