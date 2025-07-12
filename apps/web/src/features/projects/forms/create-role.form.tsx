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

import { useCreateRole } from "../hooks/use-role.hook";
import { CreateRoleSchema, createRoleSchema } from "../validations/role.schema";

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

  const { createRole, isCreating } = useCreateRole();

  const form = useForm<CreateRoleSchema>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      title: "",
      techStack: [],
      description: "",
    },
  });

  const { control } = form;
  const descriptionValue = form.watch("description");
  const characterCount = descriptionValue?.length || 0;

  const onSubmit = (data: CreateRoleSchema) => {
    createRole({ projectId, data });
    form.reset();
    setIsDialogOpen(false);
  };

  return (
    <Modal
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      title="Créer un rôle"
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
                  <FormLabel required>Titre du rôle</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Développeur Backend" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="techStack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Technologies</FormLabel>
                  <FormControl>
                    <Combobox
                      options={techStackOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Ajouter des technologies"
                      searchPlaceholder="Rechercher une technologie..."
                      emptyText="Aucune technologie trouvée."
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
                  <FormLabel required>Description</FormLabel>
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
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Création..." : "Créer le rôle"}
                <Icon name="plus" size="xs" variant="white" />
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
