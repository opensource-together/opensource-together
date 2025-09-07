"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

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
import { Modal } from "@/shared/components/ui/modal";
import { Textarea } from "@/shared/components/ui/textarea";
import { useTechStack } from "@/shared/hooks/use-tech-stack.hook";

import { useUpdateRole } from "../hooks/use-project-role.hook";
import { ProjectRole } from "../types/project-role.type";
import {
  UpdateProjectRoleSchema,
  updateProjectRoleSchema,
} from "../validations/project-role.schema";

interface EditRoleFormProps {
  children: React.ReactNode;
  role: ProjectRole;
  projectId: string;
}

export default function EditRoleForm({
  children,
  role,
  projectId,
}: EditRoleFormProps) {
  const { techStackOptions } = useTechStack();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { updateRole, isUpdating } = useUpdateRole(projectId, role.id);

  const form = useForm<UpdateProjectRoleSchema>({
    resolver: zodResolver(updateProjectRoleSchema),
    defaultValues: {
      title: role?.title || "",
      techStacks: role.techStacks?.map((tech) => tech.id) || [],
      description: role.description || "",
    },
  });

  const { control } = form;
  const descriptionValue = form.watch("description");
  const characterCount = descriptionValue?.length || 0;

  const onSubmit = (data: UpdateProjectRoleSchema) => {
    updateRole(data);
    setIsDialogOpen(false);
    form.reset();
  };

  return (
    <Modal
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      title="Modifier le rôle"
      trigger={children}
      size="lg"
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-6 overflow-y-auto">
          <Form {...form}>
            <form
              id="edit-role-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      required
                      tooltip="Donnez un nom clair au poste recherché. Cela aide les contributeurs à comprendre rapidement s'ils correspondent au profil."
                      className="text-primary mb-0 text-xs"
                    >
                      Titre du rôle
                    </FormLabel>
                    <FormControl className="mt-[-6px]">
                      <Input
                        {...field}
                        placeholder="Ex: Back-End Developer"
                        className="border border-black/15 bg-white text-neutral-500"
                      />
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
                      className="text-primary mb-0 text-xs"
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
                      className="text-primary mb-0 text-xs"
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
            </form>
          </Form>
        </div>
        <div className="sticky bottom-0 z-50 bg-white">
          <div className="-mx-4.5 mt-16.5">
            <div className="border-t border-black/10" />
            <div className="flex items-center justify-end gap-4 px-6 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsDialogOpen(false)}
              >
                Retour
              </Button>
              <Button type="submit" form="edit-role-form" disabled={isUpdating}>
                {isUpdating ? "Modification..." : "Modifier le rôle"}
                <Icon name="pencil" size="xs" variant="white" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
