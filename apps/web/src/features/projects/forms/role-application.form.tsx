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
import { Modal } from "@/shared/components/ui/modal";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";

import { useApplyToProject } from "../hooks/use-project-apply.hook";
import { KeyFeature, ProjectGoal, TechStack } from "../types/project.type";
import {
  RoleApplicationSchema,
  roleApplicationSchema,
} from "../validations/project-apply.schema";

interface RoleApplicationFormProps {
  children: React.ReactNode;
  roleTitle: string;
  roleDescription: string;
  techStacks: TechStack[];
  projectGoals: ProjectGoal[];
  keyFeatures: KeyFeature[];
  projectId: string;
  roleId: string;
}

export default function RoleApplicationForm({
  children,
  roleTitle,
  roleDescription,
  techStacks,
  projectGoals,
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

  const projectGoalOptions = projectGoals.map((goal) => ({
    id: goal.id || goal.goal,
    name: truncateText(goal.goal),
    fullName: goal.goal,
  }));

  const form = useForm<RoleApplicationSchema>({
    resolver: zodResolver(roleApplicationSchema),
    defaultValues: {
      keyFeatures: [],
      projectGoals: [],
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
      <Modal
        open={open}
        onOpenChange={setOpen}
        title={roleTitle}
        trigger={children}
        size="xl"
      >
        <div className="flex h-full flex-col">
          <div className="flex-1 space-y-6 overflow-y-auto">
            <div className="mt-4">
              <Label className="text-primary text-xs">
                Description du rôle
              </Label>
              <p className="mt-1 text-sm tracking-tighter text-neutral-500">
                {roleDescription}
              </p>
            </div>

            <Label className="text-primary mb-1.5 text-xs">
              Exigences techniques
            </Label>
            <div className="mt-1 flex flex-wrap gap-2">
              {techStacks.map((techStack, index) => (
                <StackLogo
                  key={`${techStack.name}-${index}`}
                  name={techStack.name}
                  icon={techStack.iconUrl || ""}
                  alt={techStack.name}
                />
              ))}
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
                        className="text-primary mb-0 text-xs"
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
                  name="projectGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        required
                        tooltip="Choisissez les objectifs du projet qui vous motivent le plus. Cela aide l'équipe à comprendre vos motivations et votre alignement avec la vision du projet."
                        className="text-primary mb-0 text-xs"
                      >
                        Objectifs qui vous motivent
                      </FormLabel>
                      <FormControl className="mt-[-6px]">
                        <Combobox
                          options={projectGoalOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Sélectionner des objectifs..."
                          searchPlaceholder="Rechercher un objectif..."
                          emptyText="Aucun objectif trouvé."
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
                      <FormLabel
                        tooltip="Expliquez comment vous pouvez contribuer concrètement au projet et quelles valeurs ajoutées vous apportez avec vos compétences."
                        className="text-primary mb-0 text-xs"
                      >
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
          <div className="sticky bottom-0 z-50 bg-white">
            <div className="-mx-4.5 mt-21.5">
              <div className="border-t border-black/10" />
              <div className="flex items-center justify-end gap-4 px-6 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setOpen(false)}
                >
                  Retour
                </Button>
                <Button type="submit" form="role-application-form">
                  Envoyer ma candidature
                  <Icon name="check" size="xs" variant="white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>

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
