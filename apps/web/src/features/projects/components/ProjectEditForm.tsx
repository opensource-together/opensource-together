import React, { useEffect } from "react";
import Image from "next/image";
import Button from "@/shared/ui/Button";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, ProjectFormData } from "../schema/project.schema";
import { useUpdateProject } from "../hooks/useUpdateProject";
import Breadcrumb from "@/shared/ui/Breadcrumb";
import Header from "@/shared/layout/Header";
import emptyProjectIcon from "@/shared/icons/emptyprojectIcon.svg";
import linkedinIcon from "@/shared/icons/linkedingrisicon.svg";
import starIcon from "@/shared/icons/blackstaricon.svg";
import createdIcon from "@/shared/icons/createdprojectsicon.svg";
import joinedIcon from "@/shared/icons/joinedicon.svg";
import crossIcon from "@/shared/icons/crossIcon.svg";

interface ProjectEditFormProps {
  projectId: string;
  onSuccess?: () => void;
}

export default function ProjectEditForm({ projectId, onSuccess }: ProjectEditFormProps) {
  // Utilisation du hook pour gérer l'édition (chargement + mise à jour)
  const { 
    project,
    updateProject,
    isLoading,
    isUpdating,
    isSuccess,
    isError,
    error
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
    disabled: isLoading
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
  const { 
    fields: techStackFields, 
    append: appendTechStack,
    remove: removeTechStack
  } = useFieldArray({
    control,
    name: "techStacks",
  });

  // Handler pour soumettre les données validées
  const handleFormSubmit = (data: ProjectFormData) => {
    updateProject(data);
    if (onSuccess) {
      onSuccess();
    }
  };

  // Affichage d'un état de chargement pour les données du projet
  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-16">
        {/* Formulaire Skeleton - avec dimensions fixes */}
        <div className="w-[710px] bg-white p-10 rounded-[20px] shadow-[0_2px_5px_rgba(0,0,0,0.03)] border border-black/5 flex flex-col gap-4 font-geist relative overflow-hidden">
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
            <div className="border border-black/10 rounded-[10px] px-3 py-2 w-[643px] h-[269px] bg-gray-200"></div>
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
  if (isError || !project) {
    return (
      <div className="text-red-500 p-4 rounded-md bg-red-50">
        <h2 className="text-xl font-bold">Error loading project</h2>
        <p>
          There was an error loading the project details. Please try again
          later.
        </p>
        {process.env.NODE_ENV !== "production" && error instanceof Error && (
          <p className="mt-2 text-sm font-mono">{error.message}</p>
        )}
      </div>
    );
  }

  // Rendu du formulaire avec les données chargées
  return (
    <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-16">
      <form 
        onSubmit={handleSubmit(handleFormSubmit)} 
        className="w-[710px] bg-white p-10 rounded-[20px] shadow-[0_2px_5px_rgba(0,0,0,0.03)] border border-black/5 flex flex-col gap-4 font-geist"
      >
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Image src={emptyProjectIcon} alt="empty" width={80} height={80} />
              <h2 className="text-[24px] font-medium font-geist tracking-[-0.05em]">{project.title}</h2>
            </div>
            <div className="flex items-center gap-1.5 cursor-pointer">
              <p className="text-[13px] font-medium font-geist tracking-[-0.05em]">Add Repository</p>
              <span className="text-black font-medium">+</span>
            </div>
          </div>
        </div>
        
        <input
          type="hidden"
          {...register("title")}
          value={project.title}
        />
        
        <div className="mt-4">
          <label className="block text-[15px] font-medium mb-6 font-geist">Project Description</label>
          <textarea
            {...register("description")}
            className="w-[643px] h-[269px] border border-black/10 rounded-[10px] px-3 py-2 text-[14px] font-geist focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          {errors.description && (
            <p className="text-red-500 text-[13px] mt-1">{errors.description.message}</p>
          )}
        </div>
        
        {/* Ligne en pointillés */}
        <div className="w-full border-t border-dashed border-black/10 mt-4 mb-2"></div>
        
        <div>
          <label className="block text-[15px] mb-4 font-medium font-geist tracking-[-0.05em]">Technical Stack</label>
          {techStackFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 mb-2">
              <Controller
                control={control}
                name={`techStacks.${index}.name`}
                render={({ field }) => (
                  <input
                    {...field}
                    className="w-full border border-black/10 rounded-[7px] px-3 py-2 text-[14px] font-geist focus:outline-none focus:ring-2 focus:ring-black/10"
                    placeholder="e.g. React"
                  />
                )}
              />
              <button 
                type="button"
                onClick={() => removeTechStack(index)}
                className="border border-black/10 rounded-[7px] p-2 hover:bg-gray-50"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          ))}
          <button 
            type="button" 
            onClick={() => appendTechStack({ 
              id: String(techStackFields.length + 1), 
              name: "", 
              iconUrl: "" 
            })}
            className="text-black text-[12px] mt-1 font-normal flex items-center gap-1.5"
          >
            <div className="w-[20px] h-[20px] border border-black/10 rounded-[2px] flex items-center justify-center">
              <Image src={crossIcon} alt="add" width={10} height={10} className="invert" />
            </div>
            Add technology
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
        {isError && (
          <div className="text-red-600 font-medium">Error updating project. Please try again.</div>
        )}
        {error instanceof Error && (
          <div className="text-red-600 font-medium">{error.message}</div>
        )}
      </form>

      {/* Sidebar Section */}
      <div className="w-[270px] font-geist flex flex-col gap-10">
        {/* Share Section */}
        <div>
          <h2 className="text-[18px] font-medium mb-3">Share</h2>
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <Image src={linkedinIcon} alt="LinkedIn" width={15} height={15} />
              <span className="text-[14px] text-black/70">Share on LinkedIn</span>
            </div>
            <div className="flex items-center gap-3">
              <Image src={linkedinIcon} alt="LinkedIn" width={15} height={15} />
              <span className="text-[14px] text-black/70">Share on LinkedIn</span>
            </div>
            <div className="flex items-center gap-3">
              <Image src={linkedinIcon} alt="LinkedIn" width={15} height={15} />
              <span className="text-[14px] text-black/70">Share on LinkedIn</span>
            </div>
          </div>
        </div>

        {/* Community Stats Section */}
        <div>
          <h2 className="text-[18px] font-medium mb-3">Community Stats</h2>
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <Image src={joinedIcon} alt="Joined Projects" width={15} height={13} />
              <span className="text-[14px] text-black/70">Joined Projects</span>
            </div>
            <div className="flex items-center gap-3">
              <Image src={starIcon} alt="Stars" width={15} height={14} />
              <span className="text-[14px] text-black/70">Stars</span>
            </div>
            <div className="flex items-center gap-3">
              <Image src={createdIcon} alt="Members" width={13} height={15} />
              <span className="text-[14px] text-black/70">Members</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 