import ProjectEditView from "@/features/projects/views/project-edit.view";

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
