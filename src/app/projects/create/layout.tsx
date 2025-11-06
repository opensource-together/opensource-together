import { Metadata } from "next";

import { ProjectCreateProvider } from "./project-create-provider";

interface ProjectCreateLayoutProps {
  children: React.ReactNode;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Create Project",
    description: "Create Project on OpenSource Together",
  };
}

export default function ProjectCreateLayout({
  children,
}: ProjectCreateLayoutProps) {
  return <ProjectCreateProvider>{children}</ProjectCreateProvider>;
}
