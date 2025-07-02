"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

import { useProjectCreateStore } from "@/features/projects/stores/project-create.store";

export function StepFourForm() {
  const router = useRouter();
  const { formData, resetForm } = useProjectCreateStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simuler un délai d'API
      console.log("Début de la création du projet...");
      console.log("Données du projet:", {
        ...formData,
        createdAt: new Date().toISOString(),
        status: "DRAFT",
      });

      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Projet créé avec succès !");

      resetForm();
      router.push("/");
    } catch (error) {
      console.error("Erreur lors de la création du projet:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full p-6">
        {/* Informations de base */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Informations générales</h3>
            <div className="mt-2 space-y-2">
              <p>
                <span className="font-medium">Nom du projet :</span>{" "}
                {formData.projectName}
              </p>
              <p>
                <span className="font-medium">Description :</span>{" "}
                {formData.shortDescription}
              </p>
              {formData.image && (
                <div>
                  <span className="font-medium">Image du projet :</span>
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Image du projet"
                      className="h-32 w-32 rounded-lg border object-cover"
                    />
                  </div>
                </div>
              )}
              <p>
                <span className="font-medium">Fonctionnalités clés :</span>{" "}
                {formData.keyFeatures
                  .map((feature) => feature.title)
                  .join(", ")}
              </p>
              <p>
                <span className="font-medium">Objectifs :</span>{" "}
                {formData.projectGoals.map((goal) => goal.goal).join(", ")}
              </p>
              {formData.externalLinks && formData.externalLinks.length > 0 && (
                <div>
                  <span className="font-medium">Liens externes :</span>
                  <div className="mt-2 space-y-1">
                    {formData.externalLinks.map((link, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {link.type}
                        </Badge>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate text-sm text-blue-600 hover:underline"
                        >
                          {link.url}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Technologies et Catégories */}
          <div>
            <h3 className="text-lg font-medium">Technologies et Catégories</h3>
            <div className="mt-2 space-y-4">
              <div>
                <p className="mb-2 font-medium">Technologies :</p>
                <div className="flex flex-wrap gap-2">
                  {formData.techStack.map((tech) => (
                    <Badge key={tech.id} variant="outline">
                      {tech.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 font-medium">Catégories :</p>
                <div className="flex flex-wrap gap-2">
                  {formData.categories.map((category) => (
                    <Badge key={category.id} variant="outline">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Rôles */}
          <div>
            <h3 className="text-lg font-medium">Rôles recherchés</h3>
            <div className="mt-4 space-y-4">
              {formData.roles.map((role) => (
                <div
                  key={role.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <p className="mb-2 font-medium">{role.title}</p>
                  <p className="mb-3 text-sm text-gray-600">
                    {role.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {role.techStacks.map((tech) => (
                      <Badge key={tech.id} variant="secondary">
                        {tech.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex w-full justify-end gap-4">
        <Button variant="outline" onClick={() => window.history.back()}>
          Modifier
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Publication en cours..." : "Publier le projet"}
        </Button>
      </div>
    </div>
  );
}
