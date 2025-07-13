"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import StackLogo from "@/shared/components/logos/stack-logo";
import { Button } from "@/shared/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";

import { ProjectGoal, TechStack } from "../types/project.type";
import {
  RoleApplicationSchema,
  roleApplicationSchema,
} from "../validations/role.schema";

interface RoleApplicationFormProps {
  children: React.ReactNode;
  roleTitle: string;
  roleDescription: string;
  techStacks: TechStack[];
  projectGoals: ProjectGoal[];
}

export default function RoleApplicationForm({
  children,
  roleTitle,
  roleDescription,
  techStacks,
  projectGoals,
}: RoleApplicationFormProps) {
  const [open, setOpen] = useState(false);

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const form = useForm<RoleApplicationSchema>({
    resolver: zodResolver(roleApplicationSchema),
    defaultValues: {
      question1: "",
      projectGoal: "",
    },
  });

  const onSubmit = (data: RoleApplicationSchema) => {
    console.log("Application submitted:", data);
    setOpen(false);
    form.reset();
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title={roleTitle}
      trigger={children}
      size="lg"
    >
      <div className="space-y-6">
        <div className="mt-4">
          <Label>Description du rôle</Label>
          <p className="mt-2 tracking-tighter text-black/70">
            {roleDescription}
          </p>
        </div>

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

        <div className="h-[1px] w-full bg-black/5" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="question1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    required
                    tooltip="Expliquez comment vous pouvez contribuer concrètement au projet et quelles valeurs ajoutées vous apportez avec vos compétences."
                  >
                    Votre contribution
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Je peux aider à structurer l’API REST et gérer la scalabilité"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    required
                    tooltip="Choisissez l'objectif du projet qui vous motive le plus. Cela aide l'équipe à comprendre vos motivations et votre alignement avec la vision du projet."
                  >
                    Objectif du projet
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un objectif qui vous correspond">
                          {field.value
                            ? truncateText(field.value)
                            : "Sélectionner"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projectGoals.map((projectGoal) => (
                        <SelectItem
                          key={projectGoal.id}
                          value={projectGoal.goal}
                        >
                          {projectGoal.goal}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-4 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Retour
              </Button>
              <Button type="submit">
                Envoyer ma candidature
                <Icon name="check" size="xs" variant="white" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
}
