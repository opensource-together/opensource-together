"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";

import { useCreateProject } from "../hooks/use-projects.hook";
import {
  ProjectSchema,
  projectSchema,
} from "../validations/project.form.schema";

export default function ProjectForm() {
  const { createProject, isCreating, isCreateError } = useCreateProject();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
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
  });

  const { fields: techStackFields, append: appendTechStack } = useFieldArray({
    control,
    name: "techStacks",
  });

  const handleFormSubmit = (data: ProjectSchema) => {
    createProject({ projectId: "", data });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="font-geist mx-auto flex max-w-xl flex-col gap-4 rounded-[20px] border border-black/10 bg-white p-10 shadow-[0_2px_5px_rgba(0,0,0,0.03)]"
    >
      <h2 className="font-geist mb-2 text-[22px] font-medium">
        Create a New Project
      </h2>

      <div>
        <label className="mb-1 block text-[15px] font-medium">
          Project Title
        </label>
        <input
          {...register("title")}
          className="font-geist w-full rounded-[7px] border border-black/10 px-3 py-2 text-[14px] focus:ring-2 focus:ring-black/10 focus:outline-none"
        />
        {errors.title && (
          <p className="mt-1 text-[13px] text-red-500">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-[15px] font-medium">
          Short Description
        </label>
        <input
          {...register("description")}
          className="font-geist w-full rounded-[7px] border border-black/10 px-3 py-2 text-[14px] focus:ring-2 focus:ring-black/10 focus:outline-none"
        />
        {errors.description && (
          <p className="mt-1 text-[13px] text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-[15px] font-medium">
          Long Description
        </label>
        <textarea
          {...register("longDescription")}
          className="font-geist w-full rounded-[7px] border border-black/10 px-3 py-2 text-[14px] focus:ring-2 focus:ring-black/10 focus:outline-none"
          rows={4}
        />
        {errors.longDescription && (
          <p className="mt-1 text-[13px] text-red-500">
            {errors.longDescription.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-[15px] font-medium">Status</label>
        <select
          {...register("status")}
          className="font-geist w-full rounded-[7px] border border-black/10 px-3 py-2 text-[14px] focus:ring-2 focus:ring-black/10 focus:outline-none"
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
        <label className="mb-1 block text-[15px] font-medium">Tech Stack</label>
        {techStackFields.map((field, index) => (
          <Controller
            key={field.id}
            control={control}
            name={`techStacks.${index}.name`}
            render={({ field }) => (
              <input
                {...field}
                className="font-geist mb-2 w-full rounded-[7px] border border-black/10 px-3 py-2 text-[14px] focus:ring-2 focus:ring-black/10 focus:outline-none"
                placeholder="e.g. React"
              />
            )}
          />
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
          className="mt-1 text-[13px] font-medium text-blue-600"
        >
          + Add Tech
        </button>
      </div>

      <Button type="submit" className="mt-4" disabled={isCreating}>
        {isCreating ? "Creating..." : "Create Project"}
      </Button>

      {isCreateError && (
        <div className="font-medium text-red-600">
          Error creating project. Please try again.
        </div>
      )}
    </form>
  );
}
