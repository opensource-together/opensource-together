import { ProjectCreateProvider } from "./project-create-provider";

interface ProjectCreateLayoutProps {
  children: React.ReactNode;
}

export default function ProjectCreateLayout({
  children,
}: ProjectCreateLayoutProps) {
  return <ProjectCreateProvider>{children}</ProjectCreateProvider>;
}
