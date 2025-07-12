import Image from "next/image";
import { Controller, UseFormReturn } from "react-hook-form";

import { AvatarUpload } from "@/shared/components/ui/avatar-upload";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";

import CreateRoleForm from "../forms/create-role.form";
import { Project, ProjectEditForm } from "../types/project.type";
import RoleCard from "./role-card.component";

interface ProjectEditModeProps {
  project: Project;
  form: UseFormReturn<ProjectEditForm>;
  isMaintainer: boolean;
  onFileSelect?: (file: File | null) => void;
}

export default function ProjectEditMode({
  project,
  form,
  isMaintainer,
  onFileSelect,
}: ProjectEditModeProps) {
  return (
    <>
      <div className="space-y-8">
        {/* Project Photo */}
        <div>
          <h3 className="mb-3 text-sm font-medium">Project Photo</h3>
          <AvatarUpload
            onFileSelect={
              onFileSelect || ((file) => console.log("File selected:", file))
            }
            accept="image/*"
            maxSize={1}
            size="xl"
            name={project.title}
            fallback={project.title}
          />
        </div>

        {/* Title */}
        <div>
          <h3 className="mb-3 text-sm font-medium">Title</h3>
          <Controller
            control={form.control}
            name="title"
            render={({ field }) => (
              <Input {...field} placeholder="Nom du projet" />
            )}
          />
        </div>

        {/* Description */}
        <div>
          <h3 className="mb-3 text-sm font-medium">Description</h3>
          <Controller
            control={form.control}
            name="description"
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Description du projet"
                className="h-[80px]"
              />
            )}
          />
          {/* separator */}
          <div className="mt-10 h-[2px] w-full bg-black/3" />
        </div>

        {/* Project Goals */}
        <div>
          <h3 className="mb-3 text-sm font-medium">Project Goals</h3>
          <Controller
            control={form.control}
            name="projectGoals"
            render={({ field }) => (
              <Textarea
                {...field}
                value={field.value || ""}
                placeholder="Objectifs du projet (utilisez des sauts de ligne pour séparer les objectifs)"
                className="h-[111px]"
              />
            )}
          />
        </div>

        {/* Key Features */}
        <div>
          <h3 className="mb-3 text-sm font-medium">Key Objectives</h3>
          <Controller
            control={form.control}
            name="keyFeatures"
            render={({ field }) => (
              <Textarea
                {...field}
                value={field.value || ""}
                placeholder="Objectifs clés (utilisez des sauts de ligne pour séparer les objectifs)"
                className="h-[177px]"
              />
            )}
          />
        </div>
      </div>

      {/* Rôles disponibles - visible même en mode édition */}
      <div>
        <div className="mb-3 flex items-center justify-between lg:max-w-[668px]">
          <p className="items-centers flex gap-1 text-lg font-medium tracking-tighter">
            Rôles Disponibles
          </p>
          {isMaintainer && (
            <CreateRoleForm projectId={project.id || ""}>
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
          )}
        </div>
        <div className="mt-6 mb-30 flex flex-col gap-3">
          {project.roles?.map((role) => (
            <RoleCard
              key={role.title}
              role={role}
              techStacks={project.techStacks}
              projectGoals={project.projectGoals}
              className="mb-3 lg:max-w-[721.96px]"
              isMaintainer={isMaintainer}
              projectId={project.id || ""}
            />
          ))}
        </div>
      </div>
    </>
  );
}
