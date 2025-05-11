"use client";

import React from "react";
import ProjectForm from "../components/ProjectForm";
import Header from "@/shared/layout/Header";

/**
 * Vue de création de projet
 * Structure la page et délègue la logique au composant ProjectForm
 */
export default function ProjectCreateView() {
  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto mt-8">
        <ProjectForm />
      </div>
    </>
  );
}
