"use client";

import Image from "next/image";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";

import ProjectDetailError from "../components/error-ui/project-detail-content-error.component";
import ProjectEditMode from "../components/project-edit-mode.component";
import ProjectFilters from "../components/project-filters.component";
import ProjectHero from "../components/project-hero.component";
import ProjectSideBar from "../components/project-side-bar.component";
import RoleCard from "../components/role-card.component";
import SkeletonProjectDetailView from "../components/skeletons/skeleton-project-detail-view.component";
import CreateRoleForm from "../forms/create-role.form";
import { useProjectEditForm } from "../hooks/use-project-edit-form.hook";
import { useProject } from "../hooks/use-projects.hook";
import { useTechStack } from "../hooks/use-tech-stack";

interface ProjectDetailViewProps {
  projectId: string;
}

export default function ProjectDetailView({
  projectId,
}: ProjectDetailViewProps) {
  const { data: project, isLoading, isError } = useProject(projectId);
  const [isEditing, setIsEditing] = useState(false);
  const { techStackOptions } = useTechStack();

  // TODO: Remplacer par la vraie logique de vérification du maintainer
  const isMaintainer = false; // Variable temporaire pour le développement

  const CATEGORIES_OPTIONS = [
    { id: "ai", name: "IA" },
    { id: "finance", name: "Finance" },
    { id: "health", name: "Santé" },
    { id: "education", name: "Education" },
    { id: "transport", name: "Transport" },
    { id: "ecommerce", name: "E-commerce" },
    { id: "security", name: "Sécurité" },
    { id: "marketing", name: "Marketing" },
    { id: "sales", name: "Vente" },
    { id: "management", name: "Gestion" },
    { id: "other", name: "Autre" },
  ];

  // Use the clean hook for form logic with success callback
  const editFormHook = useProjectEditForm(project || ({} as any), () => {
    setIsEditing(false); // Exit edit mode on success
  });

  if (isLoading) return <SkeletonProjectDetailView />;
  if (isError || !project) return <ProjectDetailError />;

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  if (!isEditing) {
    // Mode affichage normal
    return (
      <>
        <div className="mx-auto mt-12 max-w-[1300px] px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40"></div>
        <div className="mx-auto mt-2 flex max-w-[1300px] flex-col gap-8 px-4 sm:px-6 md:mt-4 md:px-8 lg:px-24 xl:px-40">
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:gap-16">
            <div className="self-start lg:sticky lg:top-[100px] lg:pb-33">
              <ProjectSideBar
                project={project}
                isMaintainer={isMaintainer}
                onEditClick={handleEditToggle}
                isEditing={isEditing}
              />
            </div>
            <div className="flex w-full flex-col gap-8 lg:max-w-[668px]">
              <ProjectHero project={project} />
              <div>
                <div className="mb-3 flex items-center justify-between lg:max-w-[668px]">
                  <p className="items-centers flex gap-1 text-lg font-medium tracking-tighter">
                    Rôles Disponibles
                  </p>
                  {isMaintainer ? (
                    <CreateRoleForm projectId={projectId}>
                      <Button>
                        Créer un rôle
                        <Image
                          src="/icons/plus-white.svg"
                          alt="plus"
                          width={12}
                          height={12}
                        />
                      </Button>
                    </CreateRoleForm>
                  ) : (
                    <ProjectFilters
                      filters={[
                        {
                          label: "",
                          value: "Plus Récent",
                          isSortButton: true,
                        },
                      ]}
                    />
                  )}
                </div>
                <div className="mt-6 mb-30 flex flex-col gap-3">
                  {project.roles?.map((role) => (
                    <RoleCard
                      key={role.title}
                      role={role}
                      techStacks={project.techStacks}
                      className="mb-3 lg:max-w-[721.96px]"
                      isMaintainer={isMaintainer}
                      projectId={projectId}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Mode édition avec hook propre
  const {
    form,
    onSubmit,
    isLoading: isFormLoading,
    keyFeaturesFields,
    projectGoalsFields,
    techStacksFields,
    categoriesFields,
    appendKeyFeature,
    removeKeyFeature,
    appendProjectGoal,
    removeProjectGoal,
    appendTechStack,
    removeTechStack,
    appendCategory,
    removeCategory,
  } = editFormHook;

  return (
    <>
      <div className="mx-auto mt-12 max-w-[1300px] px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40"></div>
      <div className="mx-auto mt-2 flex max-w-[1300px] flex-col gap-8 px-4 sm:px-6 md:mt-4 md:px-8 lg:px-24 xl:px-40">
        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:gap-16">
          <div className="self-start lg:sticky lg:top-[100px] lg:pb-33">
            <ProjectSideBar
              project={project}
              isMaintainer={isMaintainer}
              onEditClick={handleEditToggle}
              isEditing={isEditing}
              onSubmit={onSubmit}
              isSubmitting={isFormLoading}
              techStackValue={techStacksFields.map((field) => field.id)}
              onTechStackChange={(ids) => {
                // Clear current tech stacks
                techStacksFields.forEach((_, index) => removeTechStack(index));
                // Add selected tech stacks
                ids.forEach((id) => {
                  const techStack = techStackOptions.find(
                    (option) => option.id === id
                  );
                  if (techStack) {
                    appendTechStack({
                      id: techStack.id,
                      name: techStack.name,
                      iconUrl: techStack.iconUrl || "",
                    });
                  }
                });
              }}
              categoriesValue={categoriesFields.map((field) => field.id)}
              onCategoriesChange={(ids) => {
                // Clear current categories
                categoriesFields.forEach((_, index) => removeCategory(index));
                // Add selected categories
                ids.forEach((id) => {
                  const category = CATEGORIES_OPTIONS.find(
                    (option) => option.id === id
                  );
                  if (category) {
                    appendCategory({
                      id: category.id,
                      name: category.name,
                    });
                  }
                });
              }}
              externalLinksValue={{
                github: form.watch("externalLinks.github") || "",
                discord: form.watch("externalLinks.discord") || "",
                twitter: form.watch("externalLinks.twitter") || "",
                linkedin: form.watch("externalLinks.linkedin") || "",
                website: form.watch("externalLinks.website") || "",
              }}
              onExternalLinkChange={(type, value) => {
                form.setValue(`externalLinks.${type}` as any, value);
              }}
            />
          </div>
          <div className="flex w-full flex-col gap-8 lg:max-w-[668px]">
            <ProjectEditMode
              project={project}
              isMaintainer={isMaintainer}
              titleValue={form.watch("title")}
              onTitleChange={(value) => form.setValue("title", value)}
              descriptionValue={form.watch("description")}
              onDescriptionChange={(value) =>
                form.setValue("description", value)
              }
              longDescriptionValue={form.watch("longDescription")}
              onLongDescriptionChange={(value) =>
                form.setValue("longDescription", value)
              }
              projectGoalsValue={projectGoalsFields
                .map((field) => field.goal)
                .join("\n")}
              onProjectGoalsChange={(value) => {
                // Clear current goals
                projectGoalsFields.forEach((_, index) =>
                  removeProjectGoal(index)
                );
                // Add new goals
                value
                  .split("\n")
                  .filter((goal) => goal.trim())
                  .forEach((goal) => {
                    appendProjectGoal({ goal: goal.trim() });
                  });
              }}
              keyFeaturesValue={keyFeaturesFields
                .map((field) => field.title)
                .join("\n")}
              onKeyFeaturesChange={(value) => {
                // Clear current features
                keyFeaturesFields.forEach((_, index) =>
                  removeKeyFeature(index)
                );
                // Add new features
                value
                  .split("\n")
                  .filter((feature) => feature.trim())
                  .forEach((feature) => {
                    appendKeyFeature({ title: feature.trim() });
                  });
              }}
              onFileSelect={(file) => {
                // Handle file upload logic here
                console.log("File selected:", file);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
