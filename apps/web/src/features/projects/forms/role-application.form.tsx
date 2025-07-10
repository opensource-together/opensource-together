"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import StackLogo from "@/shared/components/logos/stack-logo";
import { Button } from "@/shared/components/ui/button";
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

  const getTechIcon = (techStackName: string): string => {
    const specialMappings: Record<string, string> = {
      React:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
      Tailwind:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
      JavaScript:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
      TypeScript:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
      Figma:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg",
      Docker:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-plain.svg",
      Git: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
      Markdown:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/markdown/markdown-original.svg",
    };

    return specialMappings[techStackName] || "/icons/mongodb.svg";
  };

  const onSubmit = (data: RoleApplicationFormData) => {
    console.log("Application submitted:", data);
    // Ici vous pouvez traiter la soumission du formulaire
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="h-[580px] w-[541px] max-w-none px-4 py-6 [&>button]:flex [&>button]:h-[22px] [&>button]:w-[22px] [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:border [&>button]:border-black/5">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium tracking-tighter">
            {roleTitle}
          </DialogTitle>
        </DialogHeader>

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
              {techStacks.map((techStack) => (
                <StackLogo
                  key={techStack.id}
                  name={techStack.name}
                  icon={techStack.iconUrl || getTechIcon(techStack.name)}
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
                        className="max-h-[80px] min-h-[80px] max-w-[460px] resize-none border-none bg-[#F9F9F9] text-black/70"
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
      </DialogContent>
    </Dialog>
  );
}
