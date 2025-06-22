import ProjectEditView from "@/features/projects/views/project-edit.view";

/**
 * Asynchronously renders the project edit page for a given project ID.
 *
 * Awaits the provided `params` Promise to extract the `projectId`, then renders the `ProjectEditView` component for that project.
 *
 * @param params - A Promise resolving to an object containing the `projectId` to edit
 * @returns A JSX element rendering the project edit view
 */
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
