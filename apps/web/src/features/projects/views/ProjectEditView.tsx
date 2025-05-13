"use client";

import React from "react";
import ProjectEditForm from "../components/ProjectEditForm";
import Header from "@/shared/layout/Header";

interface ProjectEditViewProps {
  projectId: string;
}

/**
 * Vue d'édition de projet
 * Structure la page et délègue la logique au composant ProjectEditForm
 */
export default function ProjectEditView({ projectId }: ProjectEditViewProps) {
  return (
    <>
      <Header />
      <div className="flex justify-center py-10">
        <ProjectEditForm projectId={projectId} />
      </div>
    </>
  );
} 