"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

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

import { useUpdateRole } from "../hooks/use-roles.hook";
import { useTechStack } from "../hooks/use-tech-stack";
import { ProjectRole, TechStack } from "../types/project.type";
import { UpdateRoleSchema, updateRoleSchema } from "../validations/role.schema";

interface EditRoleFormProps {
  children: React.ReactNode;
  role: ProjectRole;
  projectId: string;
  availableTechStacks?: TechStack[];
}

export default function EditRoleForm({
  children,
  role,
  projectId,
  availableTechStacks = [],
}: EditRoleFormProps) {
  const { techStackOptions } = useTechStack();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const updateRoleMutation = useUpdateRole(() => {
    setIsDialogOpen(false); // Close dialog on success
  });

  const form = useForm<UpdateRoleSchema>({
    resolver: zodResolver(updateRoleSchema),
    defaultValues: {
      title: role.title || "",
      techStackIds: role.techStacks?.map((tech) => tech.id) || [],
      description: role.description || "",
    },
  });

  // Reset form when role changes
  useEffect(() => {
    form.reset({
      title: role.title || "",
      techStackIds: role.techStacks?.map((tech) => tech.id) || [],
      description: role.description || "",
    });
  }, [role, form]);

  const descriptionValue = form.watch("description");
  const characterCount = descriptionValue?.length || 0;

  const onSubmit = (data: UpdateRoleSchema) => {
    if (!role.id) {
      console.error("Role ID is missing");
      return;
    }

    updateRoleMutation.mutate({
      projectId,
      roleId: role.id,
      data,
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-[80vh] max-h-[540px] w-[90vw] max-w-[541px] flex-col px-4 py-4 sm:px-6 sm:py-6 [&>button]:flex [&>button]:h-[22px] [&>button]:w-[22px] [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:border [&>button]:border-black/5">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium tracking-tighter">
            Modifier le rôle
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-1 flex-col overflow-hidden"
          >
            {/* Content Section - Scrollable */}
            <div className="flex-1 space-y-4 overflow-y-auto px-1 sm:space-y-6">
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
                      <Input
                        {...field}
                        placeholder="Ex: Back-End Developer"
                        className="w-full border-none bg-[#F9F9F9] text-xs text-black/70 sm:text-sm"
                      />
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
                        className="w-full text-xs sm:text-sm"
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
                    <FormLabel className="text-sm font-medium">
                      Description
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          {...field}
                          className="min-h-[100px] w-full resize-none border-none bg-[#F9F9F9] pr-16 text-xs text-black/70 sm:min-h-[120px] sm:text-sm"
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

            {/* Buttons - Fixed at bottom */}
            <div className="flex-shrink-0">
              <div className="flex flex-col justify-end gap-2 sm:flex-row sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="order-2 w-full px-3 py-2 text-xs sm:order-1 sm:w-auto sm:text-sm"
                >
                  Retour
                </Button>
                <Button
                  type="submit"
                  disabled={updateRoleMutation.isPending}
                  className="order-1 w-full px-3 py-2 text-xs sm:order-2 sm:w-auto sm:text-sm"
                >
                  {updateRoleMutation.isPending ? (
                    <span>Modification...</span>
                  ) : (
                    <span className="sm:inline">Modifier le rôle</span>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
