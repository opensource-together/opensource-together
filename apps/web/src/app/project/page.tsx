import ProjectDetailView from "@/features/projects/views/ProjectDetailView";

export default function ProjectPage() {
  // Fournir un slug par défaut (par exemple, "default-project")
  const defaultParams = { slug: "default-project" };
  return <ProjectDetailView params={defaultParams} />;
}
