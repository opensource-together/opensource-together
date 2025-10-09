"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

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
import { Textarea } from "@/shared/components/ui/textarea";

import { FormNavigationButtons } from "../../../components/stepper/stepper-navigation-buttons.component";
import { useProjectCreateStore } from "../../../stores/project-create.store";
import {
  StepDescribeProjectFormData,
  stepDescribeProjectSchema,
} from "../../../validations/project-stepper.schema";

export function StepDescribeProjectForm() {
  const { formData, updateProjectInfo } = useProjectCreateStore();
  const [coverImages, setCoverImages] = useState<File[]>(
    formData.coverImages || []
  );

  const router = useRouter();

  const form = useForm<StepDescribeProjectFormData>({
    resolver: zodResolver(stepDescribeProjectSchema),
    defaultValues: {
      title: formData.title || formData.selectedRepository?.name || "",
      description:
        formData.description || formData.selectedRepository?.description || "",
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (
      formData.selectedRepository &&
      !formData.title &&
      !formData.description
    ) {
      if (formData.selectedRepository.name) {
        setValue("title", formData.selectedRepository.name);
      }
      if (formData.selectedRepository.description) {
        setValue("description", formData.selectedRepository.description);
      }
    }
  }, [
    formData.selectedRepository,
    formData.title,
    formData.description,
    setValue,
  ]);

  const onSubmit = handleSubmit((data) => {
    updateProjectInfo({
      title: data.title,
      description: data.description,
      coverImages,
    });

    router.push("/projects/create/tech-categories");
  });

  const handlePrevious = () => {
    if (formData.method === "scratch") {
      router.push("/projects/create");
    } else if (formData.method === "github" || formData.method === "gitlab") {
      router.push(`/projects/create/${formData.method}/import`);
    }
  };

  return (
    <Form {...form}>
      <form className="flex w-full flex-col gap-5" onSubmit={onSubmit}>
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Project name</FormLabel>
              <FormControl>
                <Input placeholder="Project name" {...field} maxLength={100} />
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
              <FormLabel required>Project description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your project"
                  {...field}
                  maxLength={250}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel tooltip="Add up to 4 cover images to present your project. These images will be displayed on the project page.">
            Cover images
          </FormLabel>
          <FormControl>
            <MultipleImageUpload
              onFilesChange={setCoverImages}
              maxFiles={4}
              maxSize={5}
              accept="image/*"
            />
          </FormControl>
        </FormItem>

        <FormNavigationButtons
          onPrevious={handlePrevious}
          isLoading={isSubmitting}
          nextType="submit"
        />
      </form>
    </Form>
  );
}
