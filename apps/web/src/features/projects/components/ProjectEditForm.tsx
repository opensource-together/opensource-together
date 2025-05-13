import React, { useEffect } from "react";
import Button from "@/shared/ui/Button";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, ProjectFormData } from "../schema/project.schema";
import { useUpdateProject } from "../hooks/useUpdateProject";
import Breadcrumb from "@/shared/ui/Breadcrumb";
import Header from "@/shared/layout/Header";

interface ProjectEditFormProps {
  projectId: string;
  onSuccess?: () => void;
}

export default function ProjectEditForm({ projectId, onSuccess }: ProjectEditFormProps) {
  // Utilisation du hook pour gérer l'édition (chargement + mise à jour)
  const { 
    project,
    updateProject,
    isLoadingProject,
    isUpdating,
    isSuccess,
    isErrorProject,
    isUpdateError,
    projectError,
    updateError
  } = useUpdateProject(projectId);

  // Configuration de React Hook Form avec le resolver Zod
  const { 
    register, 
    handleSubmit, 
    control, 
    formState: { errors },
    reset
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    // Ne pas définir les defaultValues ici, on les mettra à jour via useEffect
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
    // On ne veut pas que le formulaire soit validé avant que les données ne soient chargées
    disabled: isLoadingProject
  });

  // Mise à jour des valeurs du formulaire lorsque le projet est chargé
  useEffect(() => {
    if (project) {
      console.log("Projet chargé, mise à jour du formulaire:", project);
      reset({
        title: project.title,
        description: project.description,
        longDescription: project.longDescription || "",
        status: project.status,
        techStacks: project.techStacks.length > 0 
          ? project.techStacks 
          : [{ id: "1", name: "", iconUrl: "" }],
        roles: project.roles || [],
        keyBenefits: project.keyBenefits || [],
        socialLinks: project.socialLinks || [],
      });
    }
  }, [project, reset]);

  // Gestion des champs sous forme de tableau avec useFieldArray
  const { fields: techStackFields, append: appendTechStack } = useFieldArray({
    control,
    name: "techStacks",
  });

  // Handler pour soumettre les données validées
  const handleFormSubmit = (data: ProjectFormData) => {
    updateProject(data, {
      onSuccess: () => {
        if (onSuccess) {
          onSuccess();
        }
      }
    });
  };

  // Affichage d'un état de chargement pour les données du projet
  if (isLoadingProject) {
    return (
      <>
        <Header />
        <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40 max-w-[1300px] mt-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Projects", href: "/projects" },
              { label: "Loading...", href: "#", isActive: true },
            ]}
          />
        </div>
        <div className="flex justify-center items-center py-20">
          <div className="w-[710px] h-[625px] animate-pulse bg-gray-100 rounded-[20px]"></div>
        </div>
      </>
    );
  }

  // Affichage d'une erreur lors du chargement du projet
  if (isErrorProject || !project) {
    return (
      <>
        <Header />
        <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40 max-w-[1300px] mt-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Projects", href: "/projects" },
              { label: "Error", href: "#", isActive: true },
            ]}
          />
        </div>
        <div className="flex flex-col mx-auto px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40 max-w-[1300px] mt-4 md:mt-8 gap-8">
          <div className="text-red-500 p-4 rounded-md bg-red-50">
            <h2 className="text-xl font-bold">Error loading project</h2>
            <p>
              There was an error loading the project details. Please try again
              later.
            </p>
            {process.env.NODE_ENV !== "production" &&
              projectError instanceof Error && (
                <p className="mt-2 text-sm font-mono">{projectError.message}</p>
              )}
          </div>
        </div>
      </>
    );
  }

  // Rendu du formulaire avec les données chargées
  return (
    <form 
      onSubmit={handleSubmit(handleFormSubmit)} 
      className="w-[710px] bg-white p-10 rounded-[20px] shadow-[0_2px_5px_rgba(0,0,0,0.03)] border border-black/5 flex flex-col gap-4 font-geist"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-[24px] font-medium font-geist tracking-[-0.05em]">Change Name</h2>
        <div className="flex justify-between items-center">
          <p className="text-[13px] font-medium font-geist tracking-[-0.05em]">Add Repository</p>
        </div>
      </div>
      
      <div>
        <input
          {...register("title")}
          className="w-full border border-black/10 rounded-[7px] px-3 py-2 text-[14px] font-geist focus:outline-none focus:ring-2 focus:ring-black/10"
        />
        {errors.title && (
          <p className="text-red-500 text-[13px] mt-1">{errors.title.message}</p>
        )}
      </div>
      
      <div className="mt-4">
        <label className="block text-[15px] font-medium mb-1 font-geist">Project Description</label>
        <textarea
          {...register("description")}
          className="w-[643px] h-[269px] border border-black/10 rounded-[10px] px-3 py-2 text-[14px] font-geist focus:outline-none focus:ring-2 focus:ring-black/10"
        />
        {errors.description && (
          <p className="text-red-500 text-[13px] mt-1">{errors.description.message}</p>
        )}
      </div>
      
      {/* Ligne en pointillés */}
      <div className="w-full border-t border-dashed border-black/10 my-4"></div>
      
      <div>
        <label className="block text-[15px] font-medium font-geist tracking-[-0.05em]">Technical Stack</label>
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
          className="text-black/40 text-[10px] mt-1 font-normal"
        >
          + Add technology
        </button>
      </div>
      
      <Button
        type="submit"
        className="mt-4 self-end"
        disabled={isUpdating}
        width="auto"
        height="43px"
      >
        {isUpdating ? "Saving..." : "Save Changes"}
      </Button>
      
      {isSuccess && (
        <div className="text-green-600 font-medium">Project updated successfully!</div>
      )}
      {isUpdateError && (
        <div className="text-red-600 font-medium">Error updating project. Please try again.</div>
      )}
      {updateError && (
        <div className="text-red-600 font-medium">{updateError?.message}</div>
      )}
    </form>
  );
} 