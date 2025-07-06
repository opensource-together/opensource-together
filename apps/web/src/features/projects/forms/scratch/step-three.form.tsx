"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Combobox } from "@/shared/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import Icon from "@/shared/components/ui/icon";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Modal } from "@/shared/components/ui/modal";
import { Textarea } from "@/shared/components/ui/textarea";

import {
  RoleFormData,
  StepThreeFormData,
  roleSchema,
  stepThreeSchema,
} from "@/features/projects/validations/project-stepper.schema";

import { TechStackList } from "../../../../shared/components/ui/tech-stack-list.component";
import { FormNavigationButtons } from "../../components/stepper/stepper-navigation-buttons.component";
import { useTechStack } from "../../hooks/use-tech-stack";
import { useProjectCreateStore } from "../../stores/project-create.store";

export function StepThreeForm() {
  const router = useRouter();
  const { formData, updateRoles } = useProjectCreateStore();
  const { techStackOptions, getTechStacksByIds } = useTechStack();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRoleIndex, setEditingRoleIndex] = useState<number | null>(null);

  const isEditMode = editingRoleIndex !== null;

  // Main form for managing roles
  const mainForm = useForm<StepThreeFormData>({
    resolver: zodResolver(stepThreeSchema),
    defaultValues: {
      roles:
        formData.roles?.map((role) => ({
          title: role.title,
          description: role.description,
          techStack: role.techStacks?.map((tech) => tech.id) || [],
        })) || [],
    },
  });

  const {
    control: mainControl,
    handleSubmit: handleMainSubmit,
    formState: { isSubmitting },
  } = mainForm;

  const {
    fields: roleFields,
    append: appendRole,
    update: updateRole,
    remove: removeRole,
  } = useFieldArray({
    control: mainControl,
    name: "roles",
  });

  // Role form for modal
  const roleForm = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      title: "",
      description: "",
      techStack: [],
    },
  });

  const {
    control: roleControl,
    handleSubmit: handleRoleSubmit,
    reset: resetRoleForm,
  } = roleForm;

  const handlePrevious = () => {
    router.push("/projects/create/scratch/step-two");
  };

  const onSubmit = handleMainSubmit((data) => {
    const formattedRoles = data.roles.map((role) => ({
      id: crypto.randomUUID(),
      title: role.title,
      description: role.description,
      techStacks: getTechStacksByIds(role.techStack).map((tech) => ({
        id: tech.id,
        name: tech.name,
      })),
    }));

    updateRoles(formattedRoles);
    router.push("/projects/create/scratch/step-four");
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
    const role = roleFields[index];
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
      updateRole(editingRoleIndex, data);
    } else {
      appendRole(data);
    }
    resetRoleForm();
    setShowRoleModal(false);
    setEditingRoleIndex(null);
  });

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddRole(e);
  };

  const handleRemoveRole = (index: number) => {
    removeRole(index);
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
    <Form {...mainForm}>
      <form className="flex w-full flex-col gap-8" onSubmit={onSubmit}>
        <FormField
          control={mainControl}
          name="roles"
          render={() => (
            <FormItem>
              <div>
                <Button
                  onClick={openCreateModal}
                  size="lg"
                  className="w-full"
                  type="button"
                >
                  Créer un nouveau rôle
                  <Icon name="plus" size="xs" variant="white" />
                </Button>
                {roleFields.length > 0 && (
                  <div className="mt-16 flex items-center justify-between">
                    <Label className="text-lg">Rôles créés</Label>
                    <span className="tracking-tighter text-black/20">
                      {roleFields.length}/6
                    </span>
                  </div>
                )}

                <div className="mt-4 flex flex-col gap-6">
                  {roleFields.map((role, index) => (
                    <div
                      key={role.id}
                      className="group relative overflow-hidden rounded-3xl border border-black/5 p-4 shadow-xs md:p-6"
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl font-medium tracking-tighter text-black">
                          {role.title}
                        </h3>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(index)}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full p-2 transition-colors hover:bg-black/5"
                            title="Modifier le rôle"
                          >
                            <Icon name="pencil" variant="gray" size="sm" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveRole(index)}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full p-2 transition-colors hover:bg-black/5"
                            title="Supprimer le rôle"
                          >
                            <Icon name="cross" variant="gray" size="xs" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="mt-4 text-start text-sm leading-relaxed text-black/70">
                          {role.description}
                        </p>
                      </div>

                      <div className="mt-6 h-px w-full border-t border-black/5"></div>

                      <div className="mt-6">
                        <TechStackList techStackIds={role.techStack} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Modal
          open={showRoleModal}
          onOpenChange={handleCloseModal}
          title={
            isEditMode ? "Modifier le rôle" : "Ajouter des exigences de rôle"
          }
          footer={modalFooter}
          size="xl"
        >
          <Form {...roleForm}>
            <form
              id="role-form"
              onSubmit={handleModalSubmit}
              className="space-y-6"
            >
              <FormField
                control={roleControl}
                name="title"
                render={({ field }) => (
                  <FormItem className="mt-6">
                    <FormLabel required>Titre du rôle</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ex: Développeur Frontend"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={roleControl}
                name="techStack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Technologies (max 6)</FormLabel>
                    <FormControl>
                      <Combobox
                        options={techStackOptions}
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder="Sélectionner les technologies..."
                        searchPlaceholder="Rechercher une technologie..."
                        emptyText="Aucune technologie trouvée."
                        maxSelections={6}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={roleControl}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Décrivez les responsabilités et attentes pour ce rôle"
                        className="h-32 resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </Modal>

        <FormNavigationButtons
          onPrevious={handlePrevious}
          previousLabel="Retour"
          nextLabel="Suivant"
          isLoading={isSubmitting}
          isNextDisabled={roleFields.length === 0}
          nextType="submit"
        />
      </form>
    </Form>
  );
}
