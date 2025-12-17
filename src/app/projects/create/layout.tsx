import type { Metadata } from "next";

import FooterMinimal from "@/shared/components/layout/footer-minimal.component";

import { ProjectCreateProvider } from "./project-create-provider";

interface ProjectCreateLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Create Project",
  description: "Create a new project on OpenSource Together",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProjectCreateLayout({
  children,
}: ProjectCreateLayoutProps) {
  return (
    <ProjectCreateProvider>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col md:min-h-[calc(100vh-5rem)]">
        <main className="w-full">{children}</main>
        <div className="mt-auto px-4 md:px-10">
          <FooterMinimal />
        </div>
      </div>
    </ProjectCreateProvider>
  );
}
