import Link from "next/link";
import type { UseFormReturn } from "react-hook-form";

import { AvatarUpload } from "@/shared/components/ui/avatar-upload";
import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { MultipleImageUpload } from "@/shared/components/ui/multiple-image-upload";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";

import type { Project } from "../types/project.type";
import type { UpdateProjectApiData } from "../validations/project.schema";

interface ProjectMainEditFormProps {
  project: Project;
  form: UseFormReturn<UpdateProjectApiData>;
  onSubmit: () => void;
  onImageSelect: (file: File | null) => void;
  isUpdating: boolean;
  onCoverFilesChange?: (files: File[]) => void;
  onRemoveExistingCover?: (imageUrl: string, index: number) => void;
  currentCoverImages?: string[];
}

export default function ProjectMainEditForm({
  project,
  form,
  onSubmit,
  onImageSelect,
  isUpdating,
  onCoverFilesChange,
  onRemoveExistingCover,
  currentCoverImages,
}: ProjectMainEditFormProps) {
  const { control } = form;

  return (
    <div className="mb-30 flex w-full flex-col gap-8 lg:max-w-xl">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4 lg:w-[648px]">
          <FormField
            control={control}
            name="logoUrl"
            render={() => (
              <FormItem>
                <FormLabel className="font-medium text-primary text-sm">
                  Choose a logo
                </FormLabel>
                <FormControl>
                  <AvatarUpload
                    onFileSelect={onImageSelect}
                    accept="image/*"
                    maxSize={1}
                    size="xl"
                    shape="rounded"
                    name={project.title}
                    fallback={project.title}
                    className="mt-4"
                    currentImageUrl={project.logoUrl || undefined}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  required
                  className="mb-2 font-medium text-primary text-sm"
                >
                  Title
                </FormLabel>
                <FormControl className="mt-[-6px]">
                  <Input
                    {...field}
                    placeholder="Project name"
                    className="bg-white text-primary text-sm"
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
                  className="mb-2 font-medium text-primary text-sm"
                >
                  Description
                </FormLabel>
                <FormControl className="mt-[-6px]">
                  <Textarea
                    {...field}
                    placeholder="Project description"
                    className="min-h-[120px] w-full resize-none bg-white text-primary text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          <FormField
            control={control}
            name="imagesUrls"
            render={() => (
              <FormItem>
                <FormLabel
                  tooltip="Add up to 4 cover images."
                  className="mb-2 font-medium text-primary text-sm"
                >
                  Cover images
                </FormLabel>
                <FormControl className="mt-[-6px]">
                  <MultipleImageUpload
                    accept="image/*"
                    maxFiles={4}
                    maxSize={5}
                    currentImages={
                      currentCoverImages ?? project.imagesUrls ?? []
                    }
                    onFilesChange={(files) => onCoverFilesChange?.(files)}
                    onRemoveCurrentImage={(imageUrl, index) =>
                      onRemoveExistingCover?.(imageUrl, index)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex w-full justify-end gap-4">
            <Link href={`/projects/${project.id}`}>
              <Button variant="secondary" disabled={isUpdating}>
                Back
              </Button>
            </Link>
            <Button onClick={onSubmit} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Confirm"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
