"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import StackLogo from "@/shared/components/logos/stack-logo";
import { Button } from "@/shared/components/ui/button";
import { Combobox } from "@/shared/components/ui/combobox";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import Icon from "@/shared/components/ui/icon";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { Textarea } from "@/shared/components/ui/textarea";

import { useApplyToProject } from "../hooks/use-project-apply.hook";
import { KeyFeature, TechStack } from "../types/project.type";
import {
  RoleApplicationSchema,
  roleApplicationSchema,
} from "../validations/project-apply.schema";

interface RoleApplicationFormProps {
  children: React.ReactNode;
  roleTitle: string;
  roleDescription: string;
  techStacks: TechStack[];
  keyFeatures: KeyFeature[];
  projectId: string;
  roleId: string;
}

export default function RoleApplicationForm({
  children,
  roleTitle,
  roleDescription,
  techStacks,
  keyFeatures,
  projectId,
  roleId,
}: RoleApplicationFormProps) {
  const [open, setOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { applyToProject, isApplying } = useApplyToProject(projectId, roleId);

  const truncateText = (text: string, maxLength: number = 40) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const keyFeatureOptions = keyFeatures.map((feature) => ({
    id: feature.id || feature.feature,
    name: truncateText(feature.feature),
    fullName: feature.feature,
  }));

  const form = useForm<RoleApplicationSchema>({
    resolver: zodResolver(roleApplicationSchema),
    defaultValues: {
      keyFeatures: [],
      motivationLetter: "",
    },
  });

  const onSubmit = (_data: RoleApplicationSchema) => {
    setIsConfirmOpen(true);
  };

  const handleConfirmSubmit = () => {
    const formData = form.getValues();
    applyToProject(formData, {
      onSuccess: () => {
        setOpen(false);
        setIsConfirmOpen(false);
        form.reset();
      },
      onError: () => {
        setIsConfirmOpen(false);
      },
    });
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent
          responsive
          responsiveWidth={{ desktop: "w-[540px]" }}
          className="mt-4 mr-4 overflow-y-auto rounded-t-[22px] md:h-[97vh] md:rounded-[22px]"
        >
          <div className="flex h-full flex-col">
            <SheetHeader className="sticky top-0 z-50 bg-white">
              <div className="-mx-6">
                <div className="px-6 pb-4">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-left font-medium">
                      Postuler pour le rôle {roleTitle}
                    </SheetTitle>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-[10px] w-[10px]"
                      onClick={() => setOpen(false)}
                    >
                      <Icon name="cross" size="xs" />
                    </Button>
                  </div>
                </div>
                <div className="border-b border-black/10" />
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto">
              <div className="mt-6 space-y-6">
                <div>
                  <Label>Description du rôle</Label>
                  <p className="mt-3 tracking-tighter text-neutral-500">
                    {roleDescription}
                  </p>
                </div>

                <div className="mt-6">
                  <Label>Exigences techniques</Label>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {techStacks.map((techStack, index) => (
                      <StackLogo
                        key={`${techStack.name}-${index}`}
                        name={techStack.name}
                        icon={techStack.iconUrl || ""}
                        alt={techStack.name}
                      />
                    ))}
                  </div>
                </div>

                <Separator />

                <Form {...form}>
                  <form
                    id="role-application-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="keyFeatures"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            required
                            tooltip="Sélectionnez les fonctionnalités clés du projet qui vous intéressent le plus et sur lesquelles vous aimeriez contribuer."
                          >
                            Fonctionnalités qui vous intéressent
                          </FormLabel>
                          <FormControl className="mt-[-6px]">
                            <Combobox
                              options={keyFeatureOptions}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Sélectionner des fonctionnalités..."
                              searchPlaceholder="Rechercher une fonctionnalité..."
                              emptyText="Aucune fonctionnalité trouvée."
                              showTags={false}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="motivationLetter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel tooltip="Expliquez comment vous pouvez contribuer concrètement au projet et quelles valeurs ajoutées vous apportez avec vos compétences.">
                            Lettre de motivation (optionnel)
                          </FormLabel>
                          <FormControl className="mt-[-6px]">
                            <Textarea
                              {...field}
                              placeholder="Je peux aider à structurer l'API REST et gérer la scalabilité..."
                              className="h-[94px] border border-black/15 bg-white text-neutral-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </div>
            </div>

            <div className="sticky bottom-0 z-50 bg-white">
              <div className="-mx-6">
                <div className="border-t border-black/10" />
                <div className="flex items-center justify-end gap-4 px-6 pt-4">
                  <Button variant="secondary" onClick={() => setOpen(false)}>
                    Retour
                  </Button>
                  <Button
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isApplying}
                    className="flex items-center gap-2"
                  >
                    {isApplying ? "Envoi..." : "Envoyer ma candidature"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Confirmer votre candidature"
        description="Êtes-vous sûr de vouloir envoyer votre candidature pour ce rôle ? Cette action ne peut pas être annulée."
        isLoading={isApplying}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </>
  );
}
