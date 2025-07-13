import Image from "next/image";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";

import { Avatar } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Combobox } from "@/shared/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Icon } from "@/shared/components/ui/icon";
import { InputWithIcon } from "@/shared/components/ui/input-with-icon";
import { useCategories } from "@/shared/hooks/use-category.hook";
import { useTechStack } from "@/shared/hooks/use-tech-stack.hook";

import { Project } from "../types/project.type";
import { ProjectSchema } from "../validations/project.schema";

interface ProjectSidebarEditFormProps {
  project: Project;
  form: UseFormReturn<ProjectSchema>;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function ProjectSidebarEditForm({
  project,
  form,
  onSubmit,
  isSubmitting,
}: ProjectSidebarEditFormProps) {
  const { techStackOptions, isLoading: techStacksLoading } = useTechStack();
  const { categoryOptions, isLoading: categoriesLoading } = useCategories();
  const { control } = form;

  return (
    <>
      {/* Action Buttons */}
      <div className="mb-3 flex gap-2">
        <Button
          size="lg"
          className="gap-2"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enregistrement..." : "Confirmer"}
          <Image
            src="/icons/edit-white-icon.svg"
            alt="pencil"
            width={12}
            height={12}
          />
        </Button>
        <Link href={`/projects/${project.id}`}>
          <Button variant="outline" size="lg" disabled={isSubmitting}>
            Annuler
          </Button>
        </Link>
      </div>

      {/* Details Section - Informative */}
      <div className="mb-3 flex flex-col">
        <h2 className="text-md mb-1 font-medium text-black">Détails</h2>
        <div className="">
          {/* Stars */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Icon
                name="star"
                size="sm"
                variant="black"
                className="opacity-50"
              />
              <span className="text-sm font-normal text-black/50">Stars</span>
            </div>
            <div className="mx-4 flex flex-1 items-center">
              <div className="h-[1px] w-full bg-black/5" />
            </div>
            <span className="text-sm font-medium text-black">
              {project.projectStats?.stars || 0}
            </span>
          </div>

          {/* Forks */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Icon
                name="fork"
                size="sm"
                variant="black"
                className="opacity-50"
              />
              <span className="text-sm font-normal text-black/50">Forks</span>
            </div>
            <div className="mx-4 flex flex-1 items-center">
              <div className="h-[1px] w-full bg-black/5" />
            </div>
            <span className="text-sm font-medium text-black">
              {project.projectStats?.forks || 0}
            </span>
          </div>

          {/* Last Commit */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Icon name="last-commit" size="sm" variant="default" />
              <span className="text-sm font-normal text-black/50">
                Last Commit
              </span>
            </div>
            <div className="mx-4 flex flex-1 items-center">
              <div className="h-[1px] w-full bg-black/5" />
            </div>
            <span className="text-sm font-medium text-black">
              {project.lastCommitAt
                ? new Date(project.lastCommitAt).toLocaleDateString("fr-FR")
                : "N/A"}
            </span>
          </div>

          {/* Contributors */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Icon
                name="people"
                size="sm"
                variant="black"
                className="opacity-50"
              />
              <span className="text-sm font-normal text-black/50">
                Contributors
              </span>
            </div>
            <div className="mx-4 flex flex-1 items-center">
              <div className="h-[1px] w-full bg-black/5" />
            </div>
            <span className="text-sm font-medium text-black">
              {project.projectStats?.contributors || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col space-y-6">
        <Form {...form}>
          {/* Tech Stack */}
          <FormField
            control={control}
            name="techStack"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Technologies (max 10)</FormLabel>
                <FormControl>
                  <Combobox
                    options={techStackOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={
                      techStacksLoading
                        ? "Chargement des technologies..."
                        : "Ajouter des technologies..."
                    }
                    searchPlaceholder="Rechercher une technologie..."
                    emptyText="Aucune technologie trouvée."
                    disabled={techStacksLoading}
                    maxSelections={10}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Categories */}
          <FormField
            control={control}
            name="categories"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Catégories (max 6)</FormLabel>
                <FormControl>
                  <Combobox
                    options={categoryOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={
                      categoriesLoading
                        ? "Chargement des catégories..."
                        : "Ajouter des catégories..."
                    }
                    searchPlaceholder="Rechercher une catégorie..."
                    emptyText="Aucune catégorie trouvée."
                    disabled={categoriesLoading}
                    maxSelections={6}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contributors Section - Informative */}
          <div className="mb-3 flex flex-col">
            <h2 className="text-md mb-2 font-medium text-black">
              Contributeurs ({project.collaborators?.length || 0})
            </h2>
            <div className="flex flex-col gap-2">
              {project.collaborators?.slice(0, 5).map((collaborator) => (
                <div key={collaborator.id} className="flex items-center gap-2">
                  <Avatar
                    src={collaborator.avatarUrl}
                    alt={collaborator.name}
                    size="sm"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-black">
                      {collaborator.name}
                    </span>
                    <span className="text-xs text-black/50">
                      {collaborator.role}
                    </span>
                  </div>
                </div>
              ))}
              {(project.collaborators?.length || 0) > 5 && (
                <span className="text-xs text-black/50">
                  +{(project.collaborators?.length || 0) - 5} autres
                </span>
              )}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-4">
            <FormLabel>Liens sociaux</FormLabel>

            <FormField
              control={control}
              name="externalLinks.github"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithIcon
                      icon="github"
                      placeholder="https://github.com/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="externalLinks.discord"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithIcon
                      icon="discord"
                      placeholder="https://discord.gg/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="externalLinks.twitter"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithIcon
                      icon="twitter"
                      placeholder="https://x.com/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="externalLinks.linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithIcon
                      icon="linkedin"
                      placeholder="https://linkedin.com/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="externalLinks.website"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithIcon
                      icon="link"
                      placeholder="https://..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      </div>
    </>
  );
}
