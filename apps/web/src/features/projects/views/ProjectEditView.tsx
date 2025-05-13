"use client";

import React from "react";
import ProjectEditForm from "../components/ProjectEditForm";
import Header from "@/shared/layout/Header";
import Breadcrumb from "@/shared/ui/Breadcrumb";
import { useProject } from "../hooks/useProjects";
import { useEffect, useState } from "react";

interface ProjectEditViewProps {
  projectId: string;
}

/**
 * Vue d'édition de projet
 * Structure la page et délègue la logique au composant ProjectEditForm
 */
export default function ProjectEditView({ projectId }: ProjectEditViewProps) {
  const { data: project, isLoading } = useProject(projectId);
  const [projectTitle, setProjectTitle] = useState("Loading...");

  useEffect(() => {
    if (project?.title) {
      setProjectTitle(project.title);
    }
  }, [project]);

  return (
    <>
      <Header />
      <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40 max-w-[1300px] mt-4">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Projects", href: "/projects" },
            { label: projectTitle, href: "#", isActive: true },
          ]}
        />
      </div>
      <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40 max-w-[1300px] mt-4 md:mt-8">
        <ProjectEditForm projectId={projectId} />
      </div>
    </>
  );
} 