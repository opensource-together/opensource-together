"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/shared/components/ui/button";
import { Combobox } from "@/shared/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";

import { useTechStack } from "../hooks/use-tech-stack";
import { ProjectRole, TechStack } from "../types/project.type";

const editRoleSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  techStackIds: z
    .array(z.string())
    .min(1, "Veuillez sélectionner au moins une technologie"),
  description: z
    .string()
    .max(200, "La description ne peut pas dépasser 200 caractères")
    .min(1, "La description est requise"),
});

type EditRoleFormData = z.infer<typeof editRoleSchema>;

interface EditRoleFormProps {
  children: React.ReactNode;
  role: ProjectRole;
  availableTechStacks?: TechStack[];
}

export default function EditRoleForm({
  children,
  role,
  availableTechStacks = [],
}: EditRoleFormProps) {
  const [open, setOpen] = useState(false);
  const { techStackOptions } = useTechStack();

  const form = useForm<EditRoleFormData>({
    resolver: zodResolver(editRoleSchema),
    defaultValues: {
      title: role.title || "",
      techStackIds: role.techStacks?.map((tech) => tech.id) || [],
      description: role.description || "",
    },
  });

  const descriptionValue = form.watch("description");
  const characterCount = descriptionValue?.length || 0;

  const onSubmit = (data: EditRoleFormData) => {
    console.log("Role updated:", data);
    // Ici vous pouvez traiter la mise à jour du rôle
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium tracking-tighter">
            Modifier le rôle
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Role Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Titre du rôle
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Back-End Developer" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tech Stack */}
              <FormField
                control={form.control}
                name="techStackIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          {...field}
                          className="min-h-[120px] resize-none pr-16"
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

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-sm"
                >
                  Annuler
                </Button>
                <Button type="submit" className="px-4 py-2 text-sm">
                  Modifier le rôle
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
