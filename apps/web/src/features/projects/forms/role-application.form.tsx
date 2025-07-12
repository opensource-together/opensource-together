"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Modal } from "@/shared/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";

import { TechStack } from "../types/project.type";

const roleApplicationSchema = z.object({
  question1: z.string().min(1, "Cette question est requise"),
  select1: z.string().min(1, "Veuillez faire une sélection"),
});

type RoleApplicationFormData = z.infer<typeof roleApplicationSchema>;

interface RoleApplicationFormProps {
  children: React.ReactNode;
  roleTitle: string;
  roleDescription: string;
  techStacks: TechStack[];
}

export default function RoleApplicationForm({
  children,
  roleTitle,
  roleDescription,
  techStacks,
}: RoleApplicationFormProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<RoleApplicationFormData>({
    resolver: zodResolver(roleApplicationSchema),
    defaultValues: {
      question1: "",
      select1: "",
    },
  });

  const onSubmit = (data: RoleApplicationFormData) => {
    console.log("Application submitted:", data);
    // Ici vous pouvez traiter la soumission du formulaire
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
      className="h-[80vh] max-h-[580px] w-[90vw] max-w-[541px] px-3 py-4 sm:px-4 sm:py-6"
    >
      <div className="space-y-6">
        {/* Description */}
        <div>
          <h4 className="mb-2 text-sm font-medium">Description du rôle</h4>
          <p className="text-sm text-black/70">{roleDescription}</p>
        </div>

        {/* Tech Requirements */}
        <div>
          <h4 className="mb-3 text-sm font-medium">Exigences techniques</h4>
          <div className="flex flex-wrap gap-2">
            {techStacks.map((techStack, index) => (
              <StackLogo
                key={`${techStack.name}-${index}`}
                name={techStack.name}
                icon={techStack.iconUrl || "/icons/mongodb.svg"}
                alt={techStack.name}
              />
            ))}
          </div>
        </div>

        {/* separator */}
        <div className="h-[1px] w-full bg-black/5" />

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Question 1 */}
            <FormField
              control={form.control}
              name="question1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Question 1
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Décrivez les prérecquis du role en une phrase"
                      className="max-h-[80px] min-h-[80px] w-full resize-none border-none bg-[#F9F9F9] text-black/70"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Select 1 */}
            <FormField
              control={form.control}
              name="select1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Sélection 1
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
                    </SelectContent>
                  </Select>
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
                Retour
              </Button>
              <Button type="submit" className="px-4 py-2 text-sm">
                Envoyer ma candidature
                <Image
                  src="/icons/validation-icon.svg"
                  alt="validation icon"
                  width={8}
                  height={8}
                />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
}
