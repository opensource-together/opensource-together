"use client";
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
import { useProject } from "../hooks/useProjects";
import { useUpdateProject } from "../hooks/useUpdateProject";
import { ProjectSchema, projectSchema } from "../schema/project.schema";

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
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-16">
        {/* Formulaire Skeleton - avec dimensions fixes */}
        <div className="w-[710px] bg-white p-10 rounded-3xl shadow-[0_2px_5px_rgba(0,0,0,0.03)] border border-black/5 flex flex-col gap-4 relative overflow-hidden">
          {/* Effet de vague avec animation exactement comme dans SkeletonProjectCard */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-gray-100 via-gray-200/70 to-gray-100"></div>

          {/* Header avec icône et titre */}
          <div className="flex flex-col gap-2 relative z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-[80px] h-[80px] bg-gray-200 rounded-sm">
                  {/* Suppression de la div qui cause des problèmes */}
                </div>
                <div className="h-6 w-48 bg-gray-200 rounded animate-[pulse_0.7s_ease-in-out_infinite]"></div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-28 bg-gray-200 rounded animate-[pulse_0.7s_ease-in-out_infinite]"></div>
                <div className="h-5 w-4 bg-gray-200 rounded animate-[pulse_0.7s_ease-in-out_infinite]"></div>
              </div>
            </div>
          </div>

          {/* Description - avec largeur fixe précise */}
          <div className="mt-4 relative z-10">
            <div className="h-5 w-48 bg-gray-200 rounded animate-[pulse_0.7s_ease-in-out_infinite] mb-6"></div>
            <div className=" rounded-[10px] px-3 py-2 w-[600px] h-[269px] bg-gray-200"></div>
          </div>

          {/* Ligne en pointillés */}
          <div className="w-full border-t border-dashed border-black/10 mt-4 mb-2 relative z-10"></div>

          {/* Technical Stack */}
          <div className="relative z-10">
            <div className="h-5 w-36 bg-gray-200 rounded animate-[pulse_0.7s_ease-in-out_infinite] mb-4"></div>

            {/* Tech stack inputs */}
            <div className="flex flex-col gap-2">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <div className="w-full h-[38px] bg-gray-200 rounded-[7px]"></div>
                  <div className="w-[41px] h-[41px] bg-gray-200 rounded-[7px]"></div>
                </div>
              ))}
            </div>

            {/* Add technology button */}
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-[20px] h-[20px] bg-gray-200 rounded-[2px]"></div>
              <div className="h-4 w-28 bg-gray-200 rounded animate-[pulse_0.7s_ease-in-out_infinite]"></div>
            </div>
          </div>

          {/* Submit button */}
          <div className="mt-4 self-end relative z-10">
            <div className="h-[43px] w-[120px] bg-gray-200 rounded-[7px]"></div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="w-[270px] flex flex-col gap-10">
          {/* Share Section */}
          <div>
            <div className="h-6 w-24 bg-gray-200 rounded animate-[pulse_0.7s_ease-in-out_infinite] mb-3"></div>
            <div className="flex flex-col gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-[15px] h-[15px] bg-gray-200 rounded-sm"></div>
                  <div className="h-4 w-36 bg-gray-200 rounded animate-[pulse_0.7s_ease-in-out_infinite]"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Stats Section */}
          <div>
            <div className="h-6 w-40 bg-gray-200 rounded animate-[pulse_0.7s_ease-in-out_infinite] mb-3"></div>
            <div className="flex flex-col gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-[15px] h-[15px] bg-gray-200 rounded-sm"></div>
                  <div className="h-4 w-36 bg-gray-200 rounded animate-[pulse_0.7s_ease-in-out_infinite]"></div>
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
      <div className="text-red-500 p-4 rounded-md bg-red-50">
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
    <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-16">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[710px] bg-white p-10 rounded-3xl shadow-[0_2px_5px_rgba(0,0,0,0.03)] border border-black/5 flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
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
            <div className="flex items-center gap-1.5 cursor-pointer">
              <p className="text-sm font-medium tracking-tighter">
                Add Repository
              </p>
              <span className="text-black font-medium">+</span>
            </div>
          </div>
        </div>

        <input type="hidden" {...register("title")} />

        <div className="mt-4">
          <label className="block font-medium mb-6">Project Description</label>
          <textarea
            {...register("description")}
            className="w-[643px] h-[269px] border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          {errors.description && (
            <p className="text-red-500 text-[13px] mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Ligne en pointillés */}
        <div className="w-full border-t border-dashed border-black/10 mt-4 mb-2"></div>

        <div>
          <label className="block mb-4 font-medium tracking-tighter">
            Technical Stack
          </label>
          {techStackFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 mb-2">
              <Controller
                control={control}
                name={`techStacks.${index}.name`}
                render={({ field }) => (
                  <input
                    {...field}
                    className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                    placeholder="e.g. React"
                  />
                )}
              />
              <button
                type="button"
                onClick={() => removeTechStack(index)}
                className="border border-black/10 rounded-sm p-2 hover:bg-gray-50"
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
            className="text-black text-sm mt-1 font-normal flex items-center gap-1.5"
          >
            <div className="size-6 border border-black/10 rounded-xs flex items-center justify-center">
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
          <div className="text-red-600 font-medium">
            Error updating project. Please try again.
          </div>
        )}
      </form>
      <RightSidebar sections={sidebarSections} />
    </div>
  );
}
