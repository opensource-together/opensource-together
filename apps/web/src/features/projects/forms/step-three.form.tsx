"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Combobox, ComboboxOption } from "@/shared/components/ui/combobox";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

import {
  RoleFormData,
  roleSchema,
} from "@/features/projects/validations/project-stepper.schema";

import { FormNavigationButtons } from "../components/form-navigation-buttons.component";
import { useProjectCreateStore } from "../stores/project-create.store";

const TECH_STACK_OPTIONS: ComboboxOption[] = [
  { id: "react", name: "React" },
  { id: "nextjs", name: "Next.js" },
  { id: "angular", name: "Angular" },
  { id: "vuejs", name: "Vue.js" },
  { id: "nodejs", name: "Node.js" },
  { id: "express", name: "Express" },
  { id: "mongodb", name: "MongoDB" },
  { id: "postgresql", name: "PostgreSQL" },
  { id: "mysql", name: "MySQL" },
  { id: "redis", name: "Redis" },
  { id: "docker", name: "Docker" },
  { id: "kubernetes", name: "Kubernetes" },
  { id: "aws", name: "AWS" },
  { id: "gcp", name: "GCP" },
  { id: "azure", name: "Azure" },
];

export function StepThreeForm() {
  const router = useRouter();
  const { formData, updateRoles } = useProjectCreateStore();
  const [roles, setRoles] = useState<RoleFormData[]>(
    formData.roles?.map((role) => ({
      title: role.title,
      description: role.description,
      techStack: role.techStacks?.map((tech) => tech.id) || [],
    })) || []
  );
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePrevious = () => {
    router.push("/projects/create/scratch/step-two");
  };

  const onSubmit = async () => {
    console.log("Starting form submission");
    setIsSubmitting(true);

    try {
      if (roles.length === 0) {
        console.error("No roles defined");
        return;
      }

      const formattedRoles = roles.map((role) => ({
        id: crypto.randomUUID(),
        title: role.title,
        description: role.description,
        techStacks: role.techStack.map((techId) => {
          const tech = TECH_STACK_OPTIONS.find((t) => t.id === techId);
          return {
            id: tech?.id || techId,
            name: tech?.name || techId,
          };
        }),
      }));

      console.log("Updating store with formatted roles:", formattedRoles);
      updateRoles(formattedRoles);

      // Navigate to the next step or success page
      router.push("/projects/create/scratch/step-four");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Role form
  const {
    register: registerRole,
    handleSubmit: handleRoleSubmit,
    formState: { errors: roleErrors },
    reset: resetRoleForm,
    control,
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      techStack: [],
    },
  });

  const onAddRole = handleRoleSubmit((data) => {
    console.log("Adding new role:", data);
    setRoles([...roles, data]);
    resetRoleForm();
    setShowRoleModal(false);
  });

  const removeRole = (index: number) => {
    console.log("Removing role at index:", index);
    setRoles(roles.filter((_, i) => i !== index));
  };

  // Modal pour ajouter un rôle
  const RoleModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/10"
      onClick={() => setShowRoleModal(false)}
    >
      <div
        className="font-geist relative flex w-[603px] flex-col items-center rounded-[20px] border border-black/5 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative mb-8 flex w-full items-center justify-center">
          <h3 className="font-geist text-[18px] font-medium">
            Créer un nouveau rôle
          </h3>
          <button
            className="absolute right-0 flex items-center justify-center"
            onClick={() => setShowRoleModal(false)}
          >
            <Image
              src="/icons/croix-suppression.svg"
              alt="close"
              width={12}
              height={12}
            />
          </button>
        </div>

        <form onSubmit={onAddRole} className="w-full space-y-6">
          <div>
            <Label>Titre du rôle</Label>
            <Input
              {...registerRole("title")}
              placeholder="Ex: Développeur Frontend"
            />
            {roleErrors.title && (
              <p className="mt-1 text-sm text-red-500">
                {roleErrors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label>Technologies (max 6)</Label>
            <Controller
              name="techStack"
              control={control}
              render={({ field }) => (
                <Combobox
                  options={TECH_STACK_OPTIONS}
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Sélectionner les technologies..."
                  searchPlaceholder="Rechercher une technologie..."
                  emptyText="Aucune technologie trouvée."
                  maxSelections={6}
                />
              )}
            />
            {roleErrors.techStack && (
              <p className="mt-1 text-sm text-red-500">
                {roleErrors.techStack.message}
              </p>
            )}
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              {...registerRole("description")}
              placeholder="Décrivez les responsabilités et attentes pour ce rôle"
              className="h-32 resize-none"
            />
            {roleErrors.description && (
              <p className="mt-1 text-sm text-red-500">
                {roleErrors.description.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Ajouter le rôle
          </Button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex w-[500px] flex-col gap-8 rounded-[20px] bg-white p-10">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <Label className="text-[18px]">Rôles ({roles.length})</Label>
          <Button
            onClick={() => setShowRoleModal(true)}
            variant="outline"
            className="gap-2"
          >
            <span>Ajouter un rôle</span>
            <Plus className="size-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {roles.map((role, index) => (
            <div
              key={index}
              className="rounded-[10px] border border-black/10 bg-white p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-geist text-[17px] font-medium">
                  {role.title}
                </h3>
                <button
                  onClick={() => removeRole(index)}
                  className="text-black/50"
                >
                  <Image
                    src="/icons/croix-suppression.svg"
                    alt="supprimer"
                    width={13}
                    height={13}
                  />
                </button>
              </div>
              <div className="mb-2 flex flex-wrap gap-2">
                {role.techStack.map((techId) => {
                  const tech = TECH_STACK_OPTIONS.find((t) => t.id === techId);
                  return (
                    tech && (
                      <Badge key={techId} variant="success">
                        {tech.name}
                      </Badge>
                    )
                  );
                })}
              </div>
              <p className="text-sm text-black/70">{role.description}</p>
            </div>
          ))}
        </div>
      </div>
      {showRoleModal && <RoleModal />}
      <FormNavigationButtons
        onPrevious={handlePrevious}
        nextLabel="Créer le projet"
        isLoading={isSubmitting}
        isNextDisabled={roles.length === 0}
        nextType="button"
        onNext={onSubmit}
      />
    </div>
  );
}
