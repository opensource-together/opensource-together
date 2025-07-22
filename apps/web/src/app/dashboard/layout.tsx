"use client";

import { ReactNode } from "react";

import useAuth from "@/features/auth/hooks/use-auth.hook";
import DashboardSidebar from "@/features/dashboard/components/dashboard-sidebar.component";
import { DashboardProjectProvider } from "@/features/dashboard/context/dashboard-project.context";
import { useProjects } from "@/features/projects/hooks/use-projects.hook";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: projects } = useProjects();
  const { currentUser } = useAuth();
  const userProjects = (projects || []).filter((project) => {
    const ownerId = project.ownerId || project.author?.ownerId;
    return currentUser && ownerId && currentUser.id === ownerId;
  });

  return (
    <DashboardProjectProvider userProjects={userProjects}>
      <div className="flex h-[calc(100vh-65px)] overflow-hidden md:h-[calc(100vh-85px)]">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto px-14 pt-12">{children}</main>
      </div>
    </DashboardProjectProvider>
  );
}
