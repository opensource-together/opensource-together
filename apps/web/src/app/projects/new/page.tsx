import ProjectCreateView from "@/features/projects/views/ProjectCreateView";

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
