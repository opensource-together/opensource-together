"use client";
import Button from "@/components/shared/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useCreateProject } from "../hooks/useProjects";
import { projectSchema, ProjectSchema } from "../schema/project.schema";

export default function ProjectForm() {
  const { createProject, isCreating, isError } = useCreateProject();

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
    createProject(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="max-w-xl mx-auto bg-white p-10 rounded-[20px] shadow-[0_2px_5px_rgba(0,0,0,0.03)] border border-black/10 flex flex-col gap-4 font-geist"
    >
      <h2 className="text-[22px] font-medium mb-2 font-geist">
        Create a New Project
      </h2>

      <div>
        <label className="block text-[15px] font-medium mb-1">
          Project Title
        </label>
        <input
          {...register("title")}
          className="w-full border border-black/10 rounded-[7px] px-3 py-2 text-[14px] font-geist focus:outline-none focus:ring-2 focus:ring-black/10"
        />
        {errors.title && (
          <p className="text-red-500 text-[13px] mt-1">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-[15px] font-medium mb-1">
          Short Description
        </label>
        <input
          {...register("description")}
          className="w-full border border-black/10 rounded-[7px] px-3 py-2 text-[14px] font-geist focus:outline-none focus:ring-2 focus:ring-black/10"
        />
        {errors.description && (
          <p className="text-red-500 text-[13px] mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-[15px] font-medium mb-1">
          Long Description
        </label>
        <textarea
          {...register("longDescription")}
          className="w-full border border-black/10 rounded-[7px] px-3 py-2 text-[14px] font-geist focus:outline-none focus:ring-2 focus:ring-black/10"
          rows={4}
        />
        {errors.longDescription && (
          <p className="text-red-500 text-[13px] mt-1">
            {errors.longDescription.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-[15px] font-medium mb-1">Status</label>
        <select
          {...register("status")}
          className="w-full border border-black/10 rounded-[7px] px-3 py-2 text-[14px] font-geist focus:outline-none focus:ring-2 focus:ring-black/10"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        {errors.status && (
          <p className="text-red-500 text-[13px] mt-1">
            {errors.status.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-[15px] font-medium mb-1">Tech Stack</label>
        {techStackFields.map((field, index) => (
          <Controller
            key={field.id}
            control={control}
            name={`techStacks.${index}.name`}
            render={({ field }) => (
              <input
                {...field}
                className="w-full border border-black/10 rounded-[7px] px-3 py-2 mb-2 text-[14px] font-geist focus:outline-none focus:ring-2 focus:ring-black/10"
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
          className="text-blue-600 text-[13px] mt-1 font-medium"
        >
          + Add Tech
        </button>
      </div>

      <Button
        type="submit"
        className="mt-4"
        disabled={isCreating}
        width="100%"
        height="43px"
      >
        {isCreating ? "Creating..." : "Create Project"}
      </Button>

      {isError && (
        <div className="text-red-600 font-medium">
          Error creating project. Please try again.
        </div>
      )}
    </form>
  );
}
