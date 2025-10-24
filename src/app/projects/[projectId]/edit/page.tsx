import { Metadata } from "next";

import ProjectEditView from "@/features/projects/views/project-edit.view";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Edit Project | OpenSource Together",
    description: "Edit your project details",
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
