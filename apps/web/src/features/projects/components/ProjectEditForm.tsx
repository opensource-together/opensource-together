"use client";

import { useProject } from "../hooks/useProjects";
import { useUpdateProject } from "../hooks/useUpdateProject";
import { ProjectSchema, projectSchema } from "../schema/project.schema";
import { RightSidebar } from "@/components/shared/rightSidebar/RightSidebar";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";

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
      console.log("Projet chargé, mise à jour du formulaire:", project);
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:gap-16">
        {/* Formulaire Skeleton - avec dimensions fixes */}
        <div className="relative flex w-[710px] flex-col gap-4 overflow-hidden rounded-3xl border border-black/5 bg-white p-10 shadow-[0_2px_5px_rgba(0,0,0,0.03)]">
          {/* Effet de vague avec animation exactement comme dans SkeletonProjectCard */}
          <div className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-gray-100 via-gray-200/70 to-gray-100"></div>

          {/* Header avec icône et titre */}
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-[80px] w-[80px] rounded-sm bg-gray-200">
                  {/* Suppression de la div qui cause des problèmes */}
                </div>
                <div className="h-6 w-48 animate-[pulse_0.7s_ease-in-out_infinite] rounded bg-gray-200"></div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-28 animate-[pulse_0.7s_ease-in-out_infinite] rounded bg-gray-200"></div>
                <div className="h-5 w-4 animate-[pulse_0.7s_ease-in-out_infinite] rounded bg-gray-200"></div>
              </div>
            </div>
          </div>

          {/* Description - avec largeur fixe précise */}
          <div className="relative z-10 mt-4">
            <div className="mb-6 h-5 w-48 animate-[pulse_0.7s_ease-in-out_infinite] rounded bg-gray-200"></div>
            <div className="h-[269px] w-[600px] rounded-[10px] bg-gray-200 px-3 py-2"></div>
          </div>

          {/* Ligne en pointillés */}
          <div className="relative z-10 mt-4 mb-2 w-full border-t border-dashed border-black/10"></div>

          {/* Technical Stack */}
          <div className="relative z-10">
            <div className="mb-4 h-5 w-36 animate-[pulse_0.7s_ease-in-out_infinite] rounded bg-gray-200"></div>

            {/* Tech stack inputs */}
            <div className="flex flex-col gap-2">
              {[1, 2].map((i) => (
                <div key={i} className="mb-2 flex items-center gap-2">
                  <div className="h-[38px] w-full rounded-[7px] bg-gray-200"></div>
                  <div className="h-[41px] w-[41px] rounded-[7px] bg-gray-200"></div>
                </div>
              ))}
            </div>

            {/* Add technology button */}
            <div className="mt-1 flex items-center gap-1.5">
              <div className="h-[20px] w-[20px] rounded-[2px] bg-gray-200"></div>
              <div className="h-4 w-28 animate-[pulse_0.7s_ease-in-out_infinite] rounded bg-gray-200"></div>
            </div>
          </div>

          {/* Submit button */}
          <div className="relative z-10 mt-4 self-end">
            <div className="h-[43px] w-[120px] rounded-[7px] bg-gray-200"></div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="flex w-[270px] flex-col gap-10">
          {/* Share Section */}
          <div>
            <div className="mb-3 h-6 w-24 animate-[pulse_0.7s_ease-in-out_infinite] rounded bg-gray-200"></div>
            <div className="flex flex-col gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-[15px] w-[15px] rounded-sm bg-gray-200"></div>
                  <div className="h-4 w-36 animate-[pulse_0.7s_ease-in-out_infinite] rounded bg-gray-200"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Stats Section */}
          <div>
            <div className="mb-3 h-6 w-40 animate-[pulse_0.7s_ease-in-out_infinite] rounded bg-gray-200"></div>
            <div className="flex flex-col gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-[15px] w-[15px] rounded-sm bg-gray-200"></div>
                  <div className="h-4 w-36 animate-[pulse_0.7s_ease-in-out_infinite] rounded bg-gray-200"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Affichage d'une erreur lors du chargement du projet
  if (isError) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-red-500">
        <h2 className="text-xl font-bold">Error loading project data</h2>
        <p>
          There was an error loading the project details for editing. Please try
          again later.
        </p>
      </div>
    );
  }

  // Rendu du formulaire avec les données chargées
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
                src="/icons/empty-project.svg"
                alt="empty"
                width={80}
                height={80}
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
