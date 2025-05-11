import React from "react";
import Button from "@/shared/ui/Button";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, ProjectFormData } from "../schema/project.schema";
import { useCreateProject } from "../hooks/useProjects";

// Plus besoin de ces props puisque tout est géré en interne
interface ProjectFormProps {
  // Propriétés optionnelles pour des cas spécifiques
  onSuccess?: () => void;
}

// Liste des technologies par défaut pour référence
const defaultTechStacks = [
  { id: "1", name: "React" },
  { id: "2", name: "Node.js" },
  { id: "3", name: "MongoDB" },
  { id: "4", name: "TailwindCSS" },
];

export default function ProjectForm({ onSuccess }: ProjectFormProps = {}) {
  // Utilisation du hook directement dans le formulaire
  const { 
    createProject, 
    isPending: isLoading, 
    isSuccess, 
    isError, 
    error, 
    reset: resetMutation
  } = useCreateProject();
  
  // Configuration de React Hook Form avec le resolver Zod
  const { 
    register, 
    handleSubmit, 
    control, 
    formState: { errors },
    reset: resetForm
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      longDescription: "",
      status: "DRAFT",
      // Initialisation avec un techStack vide par défaut
      techStacks: [{ id: "1", name: "", iconUrl: "" }],
      roles: [],
      keyBenefits: [],
      socialLinks: [],
    }
  });

  // Gestion des champs sous forme de tableau avec useFieldArray
  const { fields: techStackFields, append: appendTechStack } = useFieldArray({
    control,
    name: "techStacks",
  });

  // Handler pour soumettre les données validées
  const handleFormSubmit = (data: ProjectFormData) => {
    createProject(data, {
      onSuccess: () => {
        if (onSuccess) {
          onSuccess();
        }
        // Reset form sur succès si nécessaire
        // resetForm();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="max-w-xl mx-auto bg-white p-10 rounded-[20px] shadow-[0_2px_5px_rgba(0,0,0,0.03)] border border-black/10 flex flex-col gap-4 font-geist">
      <h2 className="text-[22px] font-medium mb-2 font-geist">Create a New Project</h2>
      
      <div>
        <label className="block text-[15px] font-medium mb-1">Project Title</label>
        <input
          {...register("title")}
          className="w-full border border-black/10 rounded-[7px] px-3 py-2 text-[14px] font-geist focus:outline-none focus:ring-2 focus:ring-black/10"
        />
        {errors.title && (
          <p className="text-red-500 text-[13px] mt-1">{errors.title.message}</p>
        )}
      </div>
      
      <div>
        <label className="block text-[15px] font-medium mb-1">Short Description</label>
        <input
          {...register("description")}
          className="w-full border border-black/10 rounded-[7px] px-3 py-2 text-[14px] font-geist focus:outline-none focus:ring-2 focus:ring-black/10"
        />
        {errors.description && (
          <p className="text-red-500 text-[13px] mt-1">{errors.description.message}</p>
        )}
      </div>
      
      <div>
        <label className="block text-[15px] font-medium mb-1">Long Description</label>
        <textarea
          {...register("longDescription")}
          className="w-full border border-black/10 rounded-[7px] px-3 py-2 text-[14px] font-geist focus:outline-none focus:ring-2 focus:ring-black/10"
          rows={4}
        />
        {errors.longDescription && (
          <p className="text-red-500 text-[13px] mt-1">{errors.longDescription.message}</p>
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
          <p className="text-red-500 text-[13px] mt-1">{errors.status.message}</p>
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
          onClick={() => appendTechStack({ 
            id: String(techStackFields.length + 1), 
            name: "", 
            iconUrl: "" 
          })}
          className="text-blue-600 text-[13px] mt-1 font-medium"
        >
          + Add Tech
        </button>
      </div>
      
      <Button
        type="submit"
        className="mt-4"
        disabled={isLoading}
        width="100%"
        height="43px"
      >
        {isLoading ? "Creating..." : "Create Project"}
      </Button>
      
      {isSuccess && (
        <div className="text-green-600 font-medium">Project created successfully!</div>
      )}
      {isError && (
        <div className="text-red-600 font-medium">Error creating project. Please try again.</div>
      )}
      {error && (
        <div className="text-red-600 font-medium">{error?.message}</div>
      )}
    </form>
  );
} 