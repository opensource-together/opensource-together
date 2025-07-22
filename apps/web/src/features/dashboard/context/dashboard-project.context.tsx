"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

import { Project } from "@/features/projects/types/project.type";

interface DashboardProjectContextType {
  selectedProject: Project | null;
  setSelectedProject: Dispatch<SetStateAction<Project | null>>;
  userProjects: Project[];
}

export const DashboardProjectContext =
  createContext<DashboardProjectContextType | null>(null);

export function DashboardProjectProvider({
  userProjects,
  children,
}: {
  userProjects: Project[];
  children: ReactNode;
}) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(
    userProjects[0] || null
  );
  return (
    <DashboardProjectContext.Provider
      value={{ selectedProject, setSelectedProject, userProjects }}
    >
      {children}
    </DashboardProjectContext.Provider>
  );
}

export function useDashboardProject() {
  const ctx = useContext(DashboardProjectContext);
  if (!ctx)
    throw new Error(
      "useDashboardProject must be used within a DashboardProjectProvider"
    );
  return ctx;
}
