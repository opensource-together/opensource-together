"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";

import { StepperWrapper } from "../../../components/stepper-wrapper.component";
import { useProjectCreateStore } from "../../../store/project-create.store";

export default function StepThreeView() {
  const router = useRouter();
  const { formData, updateRoles, resetForm } = useProjectCreateStore();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCreateProject = () => {
    // Here you would typically call your API to create the project
    // For now, we'll just show the confirmation
    setShowConfirmation(true);
  };

  const handleFinish = () => {
    resetForm();
    router.push("/projects");
  };

  if (showConfirmation) {
    return (
      <StepperWrapper currentStep={3} method="scratch">
        <div className="flex flex-col items-center justify-center p-10">
          <h2 className="mb-2 text-center text-2xl font-medium tracking-tight">
            Félicitations ! Votre projet a été créé
          </h2>
          <p className="mb-8 text-center text-sm text-black/70">
            Vous pouvez maintenant trouver vos projets dans votre tableau de
            bord "Mes projets" et les membres pourront postuler à n'importe quel
            rôle ouvert
          </p>
          <Button
            size="lg"
            variant="outline"
            className="w-full"
            onClick={handleFinish}
          >
            Voir mes projets
          </Button>
        </div>
      </StepperWrapper>
    );
  }

  return (
    <StepperWrapper currentStep={3} method="scratch">
      <div className="flex flex-col items-center p-10">
        <h2 className="mb-2 text-3xl font-medium">Configurer les rôles</h2>
        <p className="mb-8 text-center text-sm text-black/70">
          Définissez les rôles recherchés pour votre projet
        </p>

        {/* Role configuration UI would go here */}
        <div className="mb-8 text-center text-sm text-black/50">
          Interface de configuration des rôles à implémenter
        </div>

        <Button
          size="lg"
          className="mt-12 mb-4 w-full"
          onClick={handleCreateProject}
        >
          Créer un nouveau projet
        </Button>
      </div>
    </StepperWrapper>
  );
}
