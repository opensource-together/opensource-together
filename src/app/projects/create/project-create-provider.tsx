"use client";

import { ReactNode } from "react";

import { useProjectCreateNavigation } from "@/features/projects/hooks/use-project-create-navigation.hook";

interface ProjectCreateProviderProps {
  children: ReactNode;
}

export function ProjectCreateProvider({
  children,
}: ProjectCreateProviderProps) {
  useProjectCreateNavigation();

  return <>{children}</>;
}
