import { redirect } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{
    // On pourrait ajouter des paramètres ici à l'avenir
  }>;
}) {
  await params; // Attendre que la Promise soit résolue

  // Redirect to the new create flow
  redirect("/projects/create");
}
