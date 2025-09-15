import MyProjectDetailsView from "@/features/dashboard/views/projects/my-project-details.view";

export default async function MyProjectDetailsPage({
  params,
}: {
  params: Promise<{
    projectId: string;
  }>;
}) {
  const { projectId } = await params;

  return <MyProjectDetailsView projectId={projectId} />;
}
