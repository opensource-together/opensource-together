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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                  <FormControl>
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
                  <FormControl>
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
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        {...field}
                        placeholder="Décrivez les responsabilités et attentes pour ce rôle"
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

          <div className="mt-10 flex-shrink-0">
            <div className="flex flex-col justify-end gap-2 sm:flex-row sm:gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Retour
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Modification..." : "Modifier le rôle"}
                <Icon name="pencil" size="xs" variant="white" />
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
