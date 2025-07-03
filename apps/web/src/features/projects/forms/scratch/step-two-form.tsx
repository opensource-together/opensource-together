"use client";

import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { Combobox, ComboboxOption } from "@/shared/components/ui/combobox";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

import { FormNavigationButtons } from "../../components/form-navigation-buttons.component";
import { useProjectCreateStore } from "../../stores/project-create.store";
import { ExternalLink } from "../../types/project.type";

const TECH_STACK_OPTIONS: ComboboxOption[] = [
  { id: "react", name: "React" },
  { id: "nextjs", name: "Next.js" },
  { id: "angular", name: "Angular" },
  { id: "vuejs", name: "Vue.js" },
  { id: "nodejs", name: "Node.js" },
  { id: "express", name: "Express" },
  { id: "mongodb", name: "MongoDB" },
  { id: "postgresql", name: "PostgreSQL" },
  { id: "mysql", name: "MySQL" },
  { id: "redis", name: "Redis" },
  { id: "docker", name: "Docker" },
  { id: "kubernetes", name: "Kubernetes" },
  { id: "aws", name: "AWS" },
  { id: "gcp", name: "GCP" },
  { id: "azure", name: "Azure" },
];

const CATEGORIES_OPTIONS: ComboboxOption[] = [
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

const EXTERNAL_LINK_TYPES = [
  {
    id: "github",
    name: "GitHub",
    placeholder: "https://github.com/username/repo",
  },
  { id: "website", name: "Site Web", placeholder: "https://example.com" },
  {
    id: "discord",
    name: "Discord",
    placeholder: "https://discord.gg/invite-code",
  },
  {
    id: "twitter",
    name: "Twitter",
    placeholder: "https://twitter.com/username",
  },
  { id: "other", name: "Autre", placeholder: "https://example.com" },
] as const;

export function StepTwoForm() {
  const router = useRouter();
  const { formData, updateProjectInfo } = useProjectCreateStore();

  const [selectedTech, setSelectedTech] = useState<string[]>(
    Array.isArray(formData.techStack)
      ? formData.techStack.map((tech) => tech.id)
      : []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    Array.isArray(formData.categories)
      ? formData.categories.map((cat) => cat.id)
      : []
  );
  const [image, setImage] = useState(formData.image || "");
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>(
    Array.isArray(formData.externalLinks) ? formData.externalLinks : []
  );

  const [newLinkType, setNewLinkType] =
    useState<ExternalLink["type"]>("website");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addExternalLink = () => {
    if (newLinkUrl.trim()) {
      try {
        new URL(newLinkUrl.trim()); // Validate URL
        setExternalLinks((prev) => [
          ...prev,
          { type: newLinkType, url: newLinkUrl.trim() },
        ]);
        setNewLinkUrl("");
        setErrors((prev) => ({ ...prev, externalLinks: "" }));
      } catch {
        setErrors((prev) => ({ ...prev, externalLinks: "URL invalide" }));
      }
    }
  };

  const removeExternalLink = (index: number) => {
    setExternalLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePrevious = () => {
    router.push("/projects/create/scratch/step-one");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Validation
      const newErrors: Record<string, string> = {};

      if (selectedTech.length === 0) {
        newErrors.techStack = "Au moins une technologie est requise";
      }

      if (selectedCategories.length === 0) {
        newErrors.categories = "Au moins une catégorie est requise";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const selectedTechStack = TECH_STACK_OPTIONS.filter((tech) =>
        selectedTech.includes(tech.id)
      );

      const selectedCategoriesData = CATEGORIES_OPTIONS.filter((category) =>
        selectedCategories.includes(category.id)
      );

      updateProjectInfo({
        techStack: selectedTechStack,
        categories: selectedCategoriesData,
        image: image || "",
        externalLinks: externalLinks,
      });

      router.push("/projects/create/scratch/step-three");
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex w-full flex-col gap-6" onSubmit={onSubmit}>
      {/* Technologies */}
      <div>
        <Label>Technologies</Label>
        <div className="mt-2">
          <Combobox
            options={TECH_STACK_OPTIONS}
            value={selectedTech}
            onChange={setSelectedTech}
            placeholder="Sélectionner les technologies..."
            searchPlaceholder="Rechercher une technologie..."
            emptyText="Aucune technologie trouvée."
          />
        </div>
        {errors.techStack && (
          <p className="mt-1 text-start text-sm text-red-500">
            {errors.techStack}
          </p>
        )}
      </div>

      {/* Catégories */}
      <div>
        <Label>Catégories</Label>
        <div className="mt-2">
          <Combobox
            options={CATEGORIES_OPTIONS}
            value={selectedCategories}
            onChange={setSelectedCategories}
            placeholder="Sélectionner les catégories..."
            searchPlaceholder="Rechercher une catégorie..."
            emptyText="Aucune catégorie trouvée."
          />
        </div>
        {errors.categories && (
          <p className="mt-1 text-start text-sm text-red-500">
            {errors.categories}
          </p>
        )}
      </div>

      {/* Image du projet (optionnel) */}
      <div>
        <Label>Image du projet (optionnel)</Label>
        <Input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="URL de l'image du projet"
          className="mt-2"
        />
        {image && (
          <div className="mt-2">
            <img
              src={image}
              alt="Aperçu du projet"
              className="h-32 w-32 rounded-lg border object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      {/* Liens externes (optionnel) */}
      <div>
        <Label>Liens externes (optionnel)</Label>
        <div className="mt-2 space-y-3">
          <div className="flex gap-2">
            <select
              value={newLinkType}
              onChange={(e) =>
                setNewLinkType(e.target.value as ExternalLink["type"])
              }
              className="rounded border border-gray-300 px-3 py-2 text-sm"
            >
              {EXTERNAL_LINK_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            <Input
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
              placeholder={
                EXTERNAL_LINK_TYPES.find((t) => t.id === newLinkType)
                  ?.placeholder
              }
              className="flex-1"
            />
            <Button type="button" onClick={addExternalLink} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {externalLinks.length > 0 && (
            <ul className="space-y-2">
              {externalLinks.map((link, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 rounded bg-gray-50 p-2"
                >
                  <span className="text-xs font-medium text-gray-600 uppercase">
                    {link.type}
                  </span>
                  <span className="flex-1 truncate text-sm">{link.url}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExternalLink(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}

          {errors.externalLinks && (
            <p className="mt-1 text-sm text-red-500">{errors.externalLinks}</p>
          )}
        </div>
      </div>

      <FormNavigationButtons
        onPrevious={handlePrevious}
        nextLabel="Suivant"
        isLoading={isSubmitting}
        nextType="submit"
      />
    </form>
  );
}
