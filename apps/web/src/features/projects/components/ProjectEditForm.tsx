"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";

import { RightSidebar } from "@/components/shared/rightSidebar/RightSidebar";
import { Button } from "@/components/ui/button";

import { useProject } from "../hooks/useProjects";
import { useUpdateProject } from "../hooks/useUpdateProject";
import { ProjectSchema, projectSchema } from "../schema/project.schema";
import ProjectEditFormError from "./error-ui/ProjectEditFormError";
import SkeletonProjectEditForm from "./skeletons/SkeletonProjectEditForm";

interface ProjectEditFormProps {
  projectId: string;
}

export default function ProjectEditForm({ projectId }: ProjectEditFormProps) {
  const { data: project, isLoading, isError } = useProject(projectId);

  const {
    updateProject,
    isUpdating: isUpdatingProject,
    isError: isUpdateError,
  } = useUpdateProject(projectId);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProjectSchema>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      longDescription: "",
      status: "DRAFT",
      techStacks: [{ id: "1", name: "", iconUrl: "" }],
      roles: [],
      keyBenefits: [],
      socialLinks: [],
    },
    disabled: isLoading || isUpdatingProject,
  });

  const sidebarSections = [
    {
      title: "Share",
      links: [
        {
          icon: "/icons/linkedin.svg",
          label: "Partager sur LinkedIn",
          url: "https://linkedin.com/share",
        },
        {
          icon: "/icons/x-logo.svg",
          label: "Partager sur X",
          url: "https://twitter.com/intent/tweet",
        },
        {
          icon: "/icons/github.svg",
          label: "Voir sur Github",
          url: project?.socialLinks?.find((link) => link.type === "github")
            ?.url,
        },
      ],
    },
    {
      title: "Community Stats",
      links: [
        {
          icon: "/icons/joined.svg",
          label: "Projets rejoins",
          value: project?.communityStats?.contributors || 0,
        },
        {
          icon: "/icons/black-star.svg",
          label: "Stars",
          value: project?.communityStats?.stars || 0,
        },
        {
          icon: "/icons/two-people.svg",
          label: "Membres",
          value: project?.communityStats?.forks || 0,
        },
      ],
    },
  ];

  useEffect(() => {
    if (project) {
      reset(project);
    }
  }, [project, reset]);

  const {
    fields: techStackFields,
    append: appendTechStack,
    remove: removeTechStack,
  } = useFieldArray({
    control,
    name: "techStacks",
  });

  const onSubmit: SubmitHandler<ProjectSchema> = (data) => {
    updateProject({ data, projectId });
  };

  if (isLoading) return <SkeletonProjectEditForm />;
  if (isError) return <ProjectEditFormError />;

  return (
    <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:gap-16">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-[710px] flex-col gap-4 rounded-3xl border border-black/5 bg-white p-10 shadow-[0_2px_5px_rgba(0,0,0,0.03)]"
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={project?.image || "/icons/empty-project.svg"}
                alt={project?.title || "project icon"}
                width={80}
                height={80}
                className="rounded-sm"
              />
              <h2 className="text-2xl font-medium tracking-tighter">
                {project?.title || projectId}
              </h2>
            </div>
            <div className="flex cursor-pointer items-center gap-1.5">
              <p className="text-sm font-medium tracking-tighter">
                Add Repository
              </p>
              <span className="font-medium text-black">+</span>
            </div>
          </div>
        </div>

        <input type="hidden" {...register("title")} />

        <div className="mt-4">
          <label className="mb-6 block font-medium">Project Description</label>
          <textarea
            {...register("description")}
            className="h-[269px] w-[643px] rounded-lg border border-black/10 px-3 py-2 text-sm focus:ring-2 focus:ring-black/10 focus:outline-none"
          />
          {errors.description && (
            <p className="mt-1 text-[13px] text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Ligne en pointillés */}
        <div className="mt-4 mb-2 w-full border-t border-dashed border-black/10"></div>

        <div>
          <label className="mb-4 block font-medium tracking-tighter">
            Technical Stack
          </label>
          {techStackFields.map((field, index) => (
            <div key={field.id} className="mb-2 flex items-center gap-2">
              <Controller
                control={control}
                name={`techStacks.${index}.name`}
                render={({ field }) => (
                  <input
                    {...field}
                    className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:ring-2 focus:ring-black/10 focus:outline-none"
                    placeholder="e.g. React"
                  />
                )}
              />
              <button
                type="button"
                onClick={() => removeTechStack(index)}
                className="rounded-sm border border-black/10 p-2 hover:bg-gray-50"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              appendTechStack({
                id: String(techStackFields.length + 1),
                name: "",
                iconUrl: "",
              })
            }
            className="mt-1 flex items-center gap-1.5 text-sm font-normal text-black"
          >
            <div className="flex size-6 items-center justify-center rounded-xs border border-black/10">
              <Image
                src="/icons/cross-icon.svg"
                alt="add"
                width={10}
                height={10}
                className="invert"
              />
            </div>
            Add technology
          </button>
        </div>

        <Button
          type="submit"
          className="mt-4 self-end"
          disabled={isLoading || isUpdatingProject}
        >
          {isUpdatingProject ? "Saving..." : "Save Changes"}
        </Button>

        {isUpdateError && (
          <div className="font-medium text-red-600">
            Error updating project. Please try again.
          </div>
        )}
      </form>
      <RightSidebar sections={sidebarSections} />
    </div>
  );
}
