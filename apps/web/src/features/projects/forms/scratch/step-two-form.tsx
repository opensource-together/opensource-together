"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Combobox, ComboboxOption } from "@/shared/components/ui/combobox";
import { Label } from "@/shared/components/ui/label";

import { FormNavigationButtons } from "../../components/stepper/stepper-navigation-buttons.component";
import { useProjectCreateStore } from "../../stores/project-create.store";

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      <div>
        <Label required>Technologies</Label>
        <div className="mt-2">
          <Combobox
            options={TECH_STACK_OPTIONS}
            value={selectedTech}
            onChange={setSelectedTech}
            placeholder="Ajouter des technologies..."
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
      <div>
        <Label required>Catégories</Label>
        <div className="mt-2">
          <Combobox
            options={CATEGORIES_OPTIONS}
            value={selectedCategories}
            onChange={setSelectedCategories}
            placeholder="Ajouter des catégories..."
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

      <FormNavigationButtons
        onPrevious={handlePrevious}
        nextLabel="Suivant"
        isLoading={isSubmitting}
        nextType="submit"
      />
    </form>
  );
}
