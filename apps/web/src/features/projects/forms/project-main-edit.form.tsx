import { UseFormReturn } from "react-hook-form";

import { AvatarUpload } from "@/shared/components/ui/avatar-upload";
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

import { Project } from "../types/project.type";
import { ProjectSchema } from "../validations/project.schema";

interface ProjectMainEditFormProps {
  project: Project;
  form: UseFormReturn<ProjectSchema>;
  onSubmit: () => void;
  onImageSelect: (file: File | null) => void;
}

export default function ProjectMainEditForm({
  project,
  form,
  onSubmit,
  onImageSelect,
}: ProjectMainEditFormProps) {
  const { control } = form;

  return (
    <div className="flex w-full flex-col gap-8 lg:max-w-xl">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8">
          <FormField
            control={control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>Choisir un avatar</FormLabel>
                <FormControl>
                  <AvatarUpload
                    onFileSelect={onImageSelect}
                    accept="image/*"
                    maxSize={1}
                    size="xl"
                    name={project.title}
                    fallback={project.title}
                    className="mt-4"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Title */}
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nom du projet" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Description du projet"
                    className="h-[80px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* separator */}
          <div className="mt-10 h-[2px] w-full bg-black/3" />

          {/* Project Goals */}
          <FormField
            control={control}
            name="projectGoals"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Goals</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ""}
                    placeholder="Objectifs du projet (utilisez des sauts de ligne pour séparer les objectifs)"
                    className="h-[111px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Key Features */}
          <FormField
            control={control}
            name="keyFeatures"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key Objectives</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ""}
                    placeholder="Objectifs clés (utilisez des sauts de ligne pour séparer les objectifs)"
                    className="h-[177px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
