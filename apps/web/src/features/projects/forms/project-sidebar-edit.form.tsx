import Image from "next/image";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";

import { Avatar } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Combobox } from "@/shared/components/ui/combobox";
import { Form, FormField } from "@/shared/components/ui/form";
import { Icon } from "@/shared/components/ui/icon";
import { InputWithIcon } from "@/shared/components/ui/input-with-icon";

import { Project } from "../types/project.type";
import { ProjectSchema } from "../validations/project.schema";

const CATEGORIES_OPTIONS = [
  { id: "ai", name: "IA" },
  { id: "finance", name: "Finance" },
  { id: "health", name: "Santé" },
  { id: "education", name: "Education" },
  { id: "transport", name: "Transport" },
  { id: "ecommerce", name: "E-commerce" },
  { id: "security", name: "Sécurité" },
  { id: "marketing", name: "Marketing" },
  { id: "sales", name: "Vente" },
  { id: "management", name: "Gestion" },
  { id: "other", name: "Autre" },
];

interface ProjectSidebarEditFormProps {
  project: Project;
  form: UseFormReturn<ProjectSchema>;
  onSubmit: () => void;
  isSubmitting: boolean;
  techStackOptions: { id: string; name: string; iconUrl?: string }[];
}

export default function ProjectSidebarEditForm({
  project,
  form,
  onSubmit,
  isSubmitting,
  techStackOptions,
}: ProjectSidebarEditFormProps) {
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

      <Form {...form}>
        {/* Tech Stack */}
        <div className="mb-3 flex flex-col">
          <h2 className="text-md mb-2 font-medium text-black">
            Stack Technique
          </h2>
          <FormField
            control={control}
            name="techStacks"
            render={({ field }) => (
              <Combobox
                options={techStackOptions}
                value={field.value?.map((tech) => tech.id) || []}
                onChange={(selectedIds) => {
                  const selectedTechStacks = selectedIds
                    .map((id) => {
                      const tech = techStackOptions.find(
                        (option) => option.id === id
                      );
                      return tech
                        ? {
                            id: tech.id,
                            name: tech.name,
                            iconUrl: tech.iconUrl || "",
                          }
                        : null;
                    })
                    .filter(Boolean);
                  field.onChange(selectedTechStacks);
                }}
                placeholder="Choisir les technologies"
                searchPlaceholder="Rechercher..."
                emptyText="Aucune technologie trouvée."
              />
            )}
          />
        </div>

        {/* Categories */}
        <div className="mb-3 flex flex-col">
          <h2 className="text-md mb-2 font-medium text-black">Catégories</h2>
          <FormField
            control={control}
            name="categories"
            render={({ field }) => (
              <Combobox
                options={CATEGORIES_OPTIONS}
                value={field.value?.map((cat) => cat.id) || []}
                onChange={(selectedIds) => {
                  const selectedCategories = selectedIds
                    .map((id) => {
                      const category = CATEGORIES_OPTIONS.find(
                        (option) => option.id === id
                      );
                      return category
                        ? { id: category.id, name: category.name }
                        : null;
                    })
                    .filter(Boolean);
                  field.onChange(selectedCategories);
                }}
                placeholder="Choisir les catégories"
                searchPlaceholder="Rechercher..."
                emptyText="Aucune catégorie trouvée."
              />
            )}
          />
        </div>

        {/* Contributors Section - Informative */}
        <div className="mb-3 flex flex-col">
          <h2 className="text-md mb-2 font-medium text-black">
            Contributeurs Principaux
          </h2>
          <div>
            <div className="flex gap-2">
              {project.collaborators
                ?.slice(0, 5)
                .map((collaborator) => (
                  <Avatar
                    key={collaborator.id}
                    src={collaborator.avatarUrl}
                    name={collaborator.name}
                    alt={collaborator.name}
                    size="sm"
                  />
                ))}

              {/* Indicateur "+X autres" si plus de 5 collaborateurs */}
              {project.collaborators && project.collaborators.length > 5 && (
                <div className="flex size-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                  +{project.collaborators.length - 5}
                </div>
              )}

              {/* Message si aucun collaborateur */}
              {(!project.collaborators ||
                project.collaborators.length === 0) && (
                <span className="text-sm text-black/50">
                  Aucun contributeur pour le moment
                </span>
              )}
            </div>
          </div>
        </div>

        {/* External Links */}
        <div className="mb-0 flex flex-col">
          <h2 className="text-md mb-2 font-medium text-black">Liens</h2>
          <div className="space-y-2">
            <FormField
              control={control}
              name="socialLinks"
              render={({ field }) => {
                const links = field.value || [];
                const updateLink = (
                  type:
                    | "github"
                    | "website"
                    | "discord"
                    | "twitter"
                    | "linkedin"
                    | "other",
                  url: string
                ) => {
                  const newLinks = links.filter((link) => link.type !== type);
                  if (url.trim()) {
                    newLinks.push({ type, url });
                  }
                  field.onChange(newLinks);
                };

                return (
                  <>
                    <InputWithIcon
                      icon="github"
                      placeholder="https://github.com/..."
                      value={
                        links.find((link) => link.type === "github")?.url || ""
                      }
                      onChange={(e) => updateLink("github", e.target.value)}
                    />
                    <InputWithIcon
                      icon="discord"
                      placeholder="https://discord.gg/..."
                      value={
                        links.find((link) => link.type === "discord")?.url || ""
                      }
                      onChange={(e) => updateLink("discord", e.target.value)}
                    />
                    <InputWithIcon
                      icon="twitter"
                      placeholder="https://x.com/..."
                      value={
                        links.find((link) => link.type === "twitter")?.url || ""
                      }
                      onChange={(e) => updateLink("twitter", e.target.value)}
                    />
                    <InputWithIcon
                      icon="linkedin"
                      placeholder="https://linkedin.com/..."
                      value={
                        links.find((link) => link.type === "linkedin")?.url ||
                        ""
                      }
                      onChange={(e) => updateLink("linkedin", e.target.value)}
                    />
                    <InputWithIcon
                      icon="link"
                      placeholder="https://website.com..."
                      value={
                        links.find((link) => link.type === "website")?.url || ""
                      }
                      onChange={(e) => updateLink("website", e.target.value)}
                    />
                  </>
                );
              }}
            />
          </div>
        </div>
      </Form>
    </>
  );
}
