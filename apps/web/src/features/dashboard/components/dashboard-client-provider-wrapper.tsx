"use client";

import { ReactNode } from "react";

import useAuth from "@/features/auth/hooks/use-auth.hook";
import { useProjects } from "@/features/projects/hooks/use-projects.hook";

import { DashboardProjectProvider } from "../context/dashboard-project.context";

export default function DashboardClientProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const { data: projects } = useProjects();
  const { currentUser } = useAuth();
  const userProjects = (projects || []).filter((project) => {
    const ownerId = project.ownerId || project.author?.ownerId;
    return currentUser && ownerId && currentUser.id === ownerId;
  });

  return (
    <DashboardProjectProvider userProjects={userProjects}>
      {children}
    </DashboardProjectProvider>
  );
}
