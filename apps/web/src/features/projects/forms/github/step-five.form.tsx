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
import { useTechStack } from "@/shared/hooks/use-tech-stack.hook";

import {
  RoleFormData,
  StepThreeFormData,
  roleSchema,
  stepThreeSchema,
} from "@/features/projects/validations/project-stepper.schema";

import RoleCard from "../../components/role-card.component";
import { FormNavigationButtons } from "../../components/stepper/stepper-navigation-buttons.component";
import { useProjectCreateStore } from "../../stores/project-create.store";
import { ProjectRole } from "../../types/project-role.type";
import { TechStack } from "../../types/project.type";

export function StepFiveForm() {
  const router = useRouter();
  const { formData, updateRoles } = useProjectCreateStore();
  const {
    techStackOptions,
    getTechStacksByIds,
    isLoading: techStacksLoading,
  } = useTechStack();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRoleIndex, setEditingRoleIndex] = useState<number | null>(null);

  const isEditMode = editingRoleIndex !== null;

  const mainForm = useForm<StepThreeFormData>({
    resolver: zodResolver(stepThreeSchema),
    defaultValues: {
      roles:
        formData.roles?.map((role) => ({
          title: role.title,
          description: role.description,
          techStack: role.techStacks.map((tech: TechStack) => tech.id),
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
    router.push("/projects/create/github/step-four");
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
    router.push("/projects/create/github/step-six");
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
    onAddRole();
  };

  const handleRemoveRole = (index: number) => {
    removeRole(index);
  };

  const handleCloseModal = () => {
    setShowRoleModal(false);
    setEditingRoleIndex(null);
    resetRoleForm();
  };

  const convertToProjectRole = (
    role: RoleFormData,
    index: number
  ): ProjectRole => {
    const techStacks = getTechStacksByIds(role.techStack);
    return {
      id: `temp-role-${index}`,
      title: role.title,
      description: role.description,
      techStacks: techStacks.map((tech) => ({
        id: tech.id,
        name: tech.name,
        iconUrl: tech.iconUrl || "",
      })),
    };
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
                  {roleFields.map((role, index) => {
                    const projectRole = convertToProjectRole(role, index);
                    return (
                      <div key={role.id} className="relative">
                        <RoleCard
                          role={projectRole}
                          className="mb-3"
                          isMaintainer={true}
                          projectId=""
                        />
                        <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-white/80 p-1 backdrop-blur-sm">
                          <Button
                            type="button"
                            onClick={() => openEditModal(index)}
                            variant="ghost"
                            size="icon"
                          >
                            <Icon name="pencil" size="sm" />
                          </Button>
                          <Button
                            type="button"
                            onClick={() => handleRemoveRole(index)}
                            variant="ghost"
                            size="icon"
                          >
                            <Icon name="trash" size="sm" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
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
                    <FormLabel
                      required
                      tooltip="Donnez un nom clair au poste recherché. Cela aide les contributeurs à comprendre rapidement s'ils correspondent au profil."
                    >
                      Titre du rôle
                    </FormLabel>
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
                    <FormLabel
                      required
                      tooltip="Sélectionnez les technologies spécifiques que le contributeur devra maîtriser pour ce rôle. Cela permet un matching précis entre compétences et besoins."
                    >
                      Technologies (max 6)
                    </FormLabel>
                    <FormControl>
                      <Combobox
                        options={techStackOptions}
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder={
                          techStacksLoading
                            ? "Chargement des technologies..."
                            : "Sélectionner les technologies..."
                        }
                        searchPlaceholder="Rechercher une technologie..."
                        emptyText="Aucune technologie trouvée."
                        maxSelections={6}
                        disabled={techStacksLoading}
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
                    <FormLabel
                      required
                      tooltip="Décrivez en détail les missions, responsabilités et attentes pour ce rôle. Plus c'est précis, plus vous attirerez les bons profils."
                    >
                      Description
                    </FormLabel>
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
          {modalFooter}
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
