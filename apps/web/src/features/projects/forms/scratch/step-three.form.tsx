"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Combobox } from "@/shared/components/ui/combobox";
import Icon from "@/shared/components/ui/icon";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Modal } from "@/shared/components/ui/modal";
import { Textarea } from "@/shared/components/ui/textarea";

import {
  RoleFormData,
  roleSchema,
} from "@/features/projects/validations/project-stepper.schema";

import { TechStackList } from "../../../../shared/components/ui/tech-stack-list.component";
import { FormNavigationButtons } from "../../components/stepper/stepper-navigation-buttons.component";
import { useTechStack } from "../../hooks/use-tech-stack";
import { useProjectCreateStore } from "../../stores/project-create.store";

export function StepThreeForm() {
  const router = useRouter();
  const { formData, updateRoles } = useProjectCreateStore();
  const { techStackOptions, getTechStacksByIds } = useTechStack();
  const [roles, setRoles] = useState<RoleFormData[]>(
    formData.roles?.map((role) => ({
      title: role.title,
      description: role.description,
      techStack: role.techStacks?.map((tech) => tech.id) || [],
    })) || []
  );
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRoleIndex, setEditingRoleIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = editingRoleIndex !== null;

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
        techStacks: getTechStacksByIds(role.techStack).map((tech) => ({
          id: tech.id,
          name: tech.name,
        })),
      }));

      console.log("Updating store with formatted roles:", formattedRoles);
      updateRoles(formattedRoles);

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

  const openCreateModal = () => {
    setEditingRoleIndex(null);
    resetRoleForm({
      title: "",
      description: "",
      techStack: [],
    });
    setShowRoleModal(true);
  };

  const openEditModal = (index: number) => {
    const role = roles[index];
    setEditingRoleIndex(index);
    resetRoleForm({
      title: role.title,
      description: role.description,
      techStack: role.techStack,
    });
    setShowRoleModal(true);
  };

  const onAddRole = handleRoleSubmit((data) => {
    if (isEditMode && editingRoleIndex !== null) {
      // Edit existing role
      const updatedRoles = [...roles];
      updatedRoles[editingRoleIndex] = data;
      setRoles(updatedRoles);
    } else {
      // Add new role
      setRoles([...roles, data]);
    }
    resetRoleForm();
    setShowRoleModal(false);
    setEditingRoleIndex(null);
  });

  const removeRole = (index: number) => {
    console.log("Removing role at index:", index);
    setRoles(roles.filter((_, i) => i !== index));
  };

  const handleCloseModal = () => {
    setShowRoleModal(false);
    setEditingRoleIndex(null);
    resetRoleForm();
  };

  const modalFooter = (
    <div className="mt-10 flex justify-end gap-2">
      <Button variant="outline" onClick={handleCloseModal}>
        Annuler
      </Button>
      <Button type="submit" form="role-form">
        {isEditMode ? "Modifier le rôle" : "Créer le rôle"}
      </Button>
    </div>
  );

  return (
    <div className="flex w-full flex-col gap-8">
      <div>
        <Button onClick={openCreateModal} size="lg" className="w-full">
          Créer un nouveau rôle
          <Icon name="plus" size="xs" variant="white" />
        </Button>
        {roles.length > 0 && (
          <div className="mt-16 flex items-center justify-between">
            <Label className="text-lg">Rôles créés</Label>
            <span className="tracking-tighter text-black/20">
              {roles.length}/6
            </span>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-6">
          {roles.map((role, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl border border-black/5 p-4 shadow-xs md:p-6"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-medium tracking-tighter text-black">
                  {role.title}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(index)}
                    className="rounded-full p-2 hover:bg-black/5 hover:text-black/5"
                    title="Modifier le rôle"
                  >
                    <Image
                      src="/icons/pencil-gray.svg"
                      alt="modifier"
                      width={14}
                      height={14}
                    />
                  </button>
                  <button
                    onClick={() => removeRole(index)}
                    className="rounded-full p-2 hover:bg-black/5 hover:text-black/5"
                    title="Supprimer le rôle"
                  >
                    <Image
                      src="/icons/cross-gray.svg"
                      alt="supprimer"
                      width={14}
                      height={14}
                    />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="mt-4 text-start text-sm leading-relaxed text-black/70">
                  {role.description}
                </p>
              </div>

              <div className="mt-6 h-px w-full border-t border-black/5"></div>

              {/* Technologies */}
              <div className="mt-6">
                <TechStackList techStackIds={role.techStack} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={showRoleModal}
        onOpenChange={handleCloseModal}
        title={
          isEditMode ? "Modifier le rôle" : "Ajouter des exigences de rôle"
        }
        footer={modalFooter}
        size="xl"
      >
        <form id="role-form" onSubmit={onAddRole} className="space-y-6">
          <div className="mt-6">
            <Label required>Titre du rôle</Label>
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
            <Label required>Technologies (max 6)</Label>
            <Controller
              name="techStack"
              control={control}
              render={({ field }) => (
                <Combobox
                  options={techStackOptions}
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
            <Label required>Description</Label>
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
        </form>
      </Modal>

      <FormNavigationButtons
        onPrevious={handlePrevious}
        previousLabel="Retour"
        nextLabel="Suivant"
        isLoading={isSubmitting}
        isNextDisabled={roles.length === 0}
        nextType="button"
        onNext={onSubmit}
      />
    </div>
  );
}
