import { Metadata } from "next";

import { ProjectCreateProvider } from "./project-create-provider";

interface ProjectCreateLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Create Project",
  description: "Create a new project on OpenSource Together",
};

export default function ProjectCreateLayout({
  children,
}: ProjectCreateLayoutProps) {
  return <ProjectCreateProvider>{children}</ProjectCreateProvider>;
}
