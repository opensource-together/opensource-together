import ProjectCreateView from "@/features/projects/views/project-create.view";

/**
 * Asynchronously renders the project creation page.
 *
 * Awaits the resolution of incoming parameters before displaying the project creation view.
 */
export default async function ProjectPage({
  params,
}: {
  params: Promise<{
    // On pourrait ajouter des paramètres ici à l'avenir
  }>;
}) {
  await params; // Attendre que la Promise soit résolue

  return <ProjectCreateView />;
}
