"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ProjectDescribePreview } from "@/features/projects/components/stepper/project-describe-preview.component";
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
import { MultipleImageUpload } from "@/shared/components/ui/multiple-image-upload";
import { Textarea } from "@/shared/components/ui/textarea";

import { FormNavigationButtons } from "../../../components/stepper/stepper-navigation-buttons.component";
import { useProjectCreateStore } from "../../../stores/project-create.store";
import {
  type StepDescribeProjectFormData,
  stepDescribeProjectSchema,
} from "../../../validations/project-stepper.schema";

export function StepDescribeProjectForm() {
  const { formData, updateProjectInfo } = useProjectCreateStore();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(
    formData.logoFile || null
  );
  const [logoUrl, setLogoUrl] = useState<string | null>(
    formData.logoUrl || formData.selectedRepository?.logo_url || null
  );

  const router = useRouter();

  const form = useForm<StepDescribeProjectFormData>({
    resolver: zodResolver(stepDescribeProjectSchema),
    defaultValues: {
      title: formData.title || formData.selectedRepository?.name || "",
      description:
        formData.description || formData.selectedRepository?.description || "",
      imagesUrls: [],
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = form;

  // Watch form values for real-time preview
  const watchedValues = watch();

  const handleLogoSelect = (file: File | null) => {
    setLogoFile(file);
    if (file) {
      setLogoUrl(null); // Clear URL when file is selected
      setValue("logoUrl", file);
    } else {
      setValue("logoUrl", undefined);
    }
  };

  useEffect(() => {
    if (formData.selectedRepository) {
      if (formData.selectedRepository.name) {
        setValue("title", formData.selectedRepository.name);
      }
      if (formData.selectedRepository.description) {
        setValue("description", formData.selectedRepository.description);
      }
      if (formData.selectedRepository.logo_url) {
        setLogoUrl(formData.selectedRepository.logo_url);
        setLogoFile(null);
      }
    }
  }, [formData.selectedRepository, setValue]);

  const onSubmit = handleSubmit((data) => {
    let finalLogoUrl = "";
    if (logoFile) {
      finalLogoUrl = URL.createObjectURL(logoFile);
    } else if (logoUrl) {
      finalLogoUrl = logoUrl;
    } else if (data.logoUrl && typeof data.logoUrl === "string") {
      finalLogoUrl = data.logoUrl;
    }

    // Convert image files to URLs for preview
    const imagesUrls = imageFiles.map((file) => URL.createObjectURL(file));

    updateProjectInfo({
      title: data.title,
      description: data.description,
      logoUrl: finalLogoUrl,
      logoFile,
      imagesUrls,
      imageFiles,
    });

    router.push("/projects/create/tech-categories");
  });

  const handlePrevious = () => {
    if (formData.method === "github" || formData.method === "gitlab") {
      router.push(`/projects/create/${formData.method}/import`);
    }
  };

  return (
    <div className="flex w-full justify-between gap-14">
      <div className="flex-1 flex-col gap-4">
        <Form {...form}>
          <form className="mt-7 flex w-full flex-col gap-8" onSubmit={onSubmit}>
            <FormField
              control={control}
              name="logoUrl"
              render={() => (
                <FormItem>
                  <FormLabel>Choose a logo</FormLabel>
                  <FormControl>
                    <AvatarUpload
                      onFileSelect={handleLogoSelect}
                      accept="image/*"
                      maxSize={1}
                      size="xl"
                      shape="rounded"
                      name={watchedValues.title}
                      fallback={watchedValues.title}
                      currentImageUrl={logoUrl || undefined}
                      className="mt-4"
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
                  <FormLabel required>Project name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Project name"
                      {...field}
                      maxLength={100}
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
                  onFilesChange={(files) => {
                    setImageFiles(files);
                  }}
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
      </div>

      <div className="hidden w-[55%] lg:block">
        <div className="sticky top-8">
          <h3 className="mt-7 mb-4 font-medium text-lg">Preview</h3>
          <ProjectDescribePreview
            title={watchedValues.title}
            description={watchedValues.description}
            logoUrl={logoUrl || logoFile || undefined}
            imagesUrls={imageFiles.map((file) => URL.createObjectURL(file))}
          />
        </div>
      </div>
    </div>
  );
}
