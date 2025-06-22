import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";

import { Button } from "@/shared/components/ui/button";

import { useUpdateProject } from "../hooks/use-projects.hook";
import { Project } from "../types/project.type";
import {
  ProjectSchema,
  projectSchema,
} from "../validations/project.form.schema";

interface ProjectEditFormProps {
  project: Project;
}

export default function ProjectEditForm({ project }: ProjectEditFormProps) {
  const { image, title, description } = project;

  const { updateProject, isUpdating, isUpdateError } = useUpdateProject();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProjectSchema>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: title || "Sans titre",
      description: description || "",
      longDescription: project.longDescription || "",
      status: project.status || "DRAFT",
      techStacks:
        project.techStacks?.map((tech) => ({
          id: tech.id || String(Math.random()),
          name: tech.name || "",
          iconUrl: tech.iconUrl || "",
        })) || [],
      roles: project.roles || [],
      keyBenefits: project.keyBenefits || [],
      socialLinks: project.socialLinks || [],
    },
  });

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
    updateProject({ data, projectId: project.id! });
  };

  console.log("Current form values:", control._formValues);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-[710px] flex-col gap-4 rounded-3xl border border-black/5 bg-white p-10 shadow-[0_2px_5px_rgba(0,0,0,0.03)]"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={image || "/icons/empty-project.svg"}
              alt={title || "project icon"}
              width={80}
              height={80}
              className="rounded-sm"
            />
            <h2 className="text-2xl font-medium tracking-tighter">{title}</h2>
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
        <label className="mb-1 block text-[15px] font-medium">Status</label>
        <select
          {...register("status")}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:ring-2 focus:ring-black/10 focus:outline-none"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        {errors.status && (
          <p className="mt-1 text-[13px] text-red-500">
            {errors.status.message}
          </p>
        )}
      </div>
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

      <Button type="submit" className="mt-4 self-end" disabled={isUpdating}>
        {isUpdating ? "En cours..." : "Enregistrer"}
      </Button>

      {isUpdateError && (
        <div className="font-medium text-red-600">
          Erreur lors de la mise à jour du projet. Veuillez réessayer.
        </div>
      )}
    </form>
  );
}
