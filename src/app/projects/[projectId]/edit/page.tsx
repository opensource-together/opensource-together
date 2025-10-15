import { Metadata } from "next";

import { getProjectDetails } from "@/features/projects/services/project.service";
import ProjectEditView from "@/features/projects/views/project-edit.view";

type Props = {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { projectId } = await params;
  const project = await getProjectDetails(projectId);

  return {
    title: `Edit ${project.title} | OpenSource Together`,
    description: project.description,
  };
}

export default async function ProjectEditPage({
  params,
}: {
  params: Promise<{
    projectId: string;
  }>;
}) {
  const { projectId } = await params;

  return <ProjectEditView projectId={projectId} />;
}
