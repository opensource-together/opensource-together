"use client";

import React, { useEffect } from "react";
import ProjectForm from "../components/ProjectForm";
import { useCreateProject } from "../hooks/useProjects";
import Header from "@/shared/layout/Header";
import { useRouter } from "next/navigation";

interface ProjectCreateViewProps {
  // On pourrait ajouter d'autres props ici si nécessaire à l'avenir
}

export default function ProjectCreateView(props: ProjectCreateViewProps) {
  const router = useRouter();
  const mutation = useCreateProject({
    // La redirection est maintenant gérée directement dans le hook
    onError: (error) => {
      // On pourrait ajouter un toast ou une notification ici
      console.error("Erreur lors de la création du projet:", error);
    }
  });

  // Si la création est réussie et qu'on n'a pas encore été redirigé
  // Ceci est un filet de sécurité au cas où la redirection dans le hook échouerait
  useEffect(() => {
    console.log("ProjectCreateView - État de la mutation:", {
      isSuccess: mutation.isSuccess,
      data: mutation.data
    });
    
    if (mutation.isSuccess) {
      if (mutation.data?.id) {
        console.log("ProjectCreateView - Tentative de redirection vers:", `/projects/${mutation.data.id}`);
        // Force la redirection avec replace au lieu de push pour éviter les problèmes d'historique
        router.replace(`/projects/${mutation.data.id}`);
      } else {
        console.error("ProjectCreateView - Impossible de rediriger: ID manquant dans la réponse");
      }
    }
  }, [mutation.isSuccess, mutation.data, router]);

  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto mt-8">
        <ProjectForm
          onSubmit={values => {
            console.log("Soumission du formulaire:", values);
            mutation.mutate(values);
          }}
          isLoading={mutation.isPending}
          isSuccess={mutation.isSuccess}
          isError={mutation.isError}
          error={mutation.error?.message}
        />
      </div>
    </>
  );
}
