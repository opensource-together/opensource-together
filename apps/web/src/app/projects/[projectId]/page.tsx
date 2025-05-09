import ProjectDetailView from "@/features/projects/views/ProjectDetailView";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{
    projectId: string;
  }>;
}) {
  const { projectId } = await params;

  return <ProjectDetailView projectId={projectId} />;
}
