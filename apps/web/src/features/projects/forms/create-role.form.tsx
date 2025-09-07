"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Combobox } from "@/shared/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Modal } from "@/shared/components/ui/modal";
import { Textarea } from "@/shared/components/ui/textarea";
import { useTechStack } from "@/shared/hooks/use-tech-stack.hook";

import { useCreateRole } from "../hooks/use-project-role.hook";
import {
  CreateProjectRoleSchema,
  createProjectRoleSchema,
} from "../validations/project-role.schema";

interface CreateRoleFormProps {
  children: React.ReactNode;
  projectId: string;
}

export default function CreateRoleForm({
  children,
  projectId,
}: CreateRoleFormProps) {
  const { techStackOptions } = useTechStack();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { createRole, isCreating } = useCreateRole(projectId);

  const form = useForm<CreateProjectRoleSchema>({
    resolver: zodResolver(createProjectRoleSchema),
    defaultValues: {
      title: "",
      techStacks: [],
      description: "",
    },
  });

  const { control } = form;
  const descriptionValue = form.watch("description");
  const characterCount = descriptionValue?.length || 0;

  const onSubmit = (data: CreateProjectRoleSchema) => {
    createRole(data);
    form.reset();
    setIsDialogOpen(false);
  };

  return (
    <Modal
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      title="Créer un rôle"
      description="Ajoutez un nouveau rôle pour attirer les bons contributeurs."
      trigger={children}
      size="lg"
      confirmText="Créer le rôle"
      cancelText="Retour"
      onConfirm={form.handleSubmit(onSubmit)}
      onCancel={() => setIsDialogOpen(false)}
      isLoading={isCreating}
    >
      <Form {...form}>
        <form id="create-role-form" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    required
                    tooltip="Donnez un nom clair au poste recherché. Cela aide les contributeurs à comprendre rapidement s'ils correspondent au profil."
                  >
                    Titre du rôle
                  </FormLabel>
                  <FormControl className="mt-[-6px]">
                    <Input {...field} placeholder="Ex: Back-End Developer" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="techStacks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    required
                    tooltip="Sélectionnez les technologies spécifiques que le contributeur devra maîtriser pour ce rôle. Cela permet un matching précis entre compétences et besoins."
                  >
                    Technologies
                  </FormLabel>
                  <FormControl className="mt-[-6px]">
                    <Combobox
                      options={techStackOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Ajouter des technologies"
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
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    required
                    tooltip="Décrivez en détail les missions, responsabilités et attentes pour ce rôle. Plus c'est précis, plus vous attirerez les bons profils."
                  >
                    Description
                  </FormLabel>
                  <FormControl className="mt-[-6px]">
                    <div className="relative">
                      <Textarea
                        {...field}
                        placeholder="Décrivez les responsabilités et attentes pour ce rôle"
                        className="h-[94px] border border-black/15 bg-white text-neutral-500"
                      />
                      <div className="absolute right-3 bottom-3 text-xs text-gray-500">
                        {characterCount}/200
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </Modal>
  );
}
