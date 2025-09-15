import { Metadata } from "next";

import { ProjectCreateProvider } from "./project-create-provider";

interface ProjectCreateLayoutProps {
  children: React.ReactNode;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Créer un projet | OpenSource Together",
    description: "Créer un projet sur OpenSource Together",
  };
}

export default function ProjectCreateLayout({
  children,
}: ProjectCreateLayoutProps) {
  return <ProjectCreateProvider>{children}</ProjectCreateProvider>;
}
