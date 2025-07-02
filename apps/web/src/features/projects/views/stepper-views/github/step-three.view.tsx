"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";

import { StepperWrapper } from "../../../components/stepper/stepper-wrapper.component";
import { StepThreeForm } from "../../../forms/step-three.form";
import { useProjectCreateStore } from "../../../stores/project-create.store";

export default function StepThreeView() {
  const router = useRouter();
  const { resetForm } = useProjectCreateStore();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleFinish = () => {
    resetForm();
    router.push("/projects");
  };

  if (showConfirmation) {
    return (
      <StepperWrapper currentStep={3} method="github">
        <div className="font-geist flex flex-col items-center justify-center rounded-[20px] bg-white p-10">
          <h2 className="font-geist mb-2 text-center text-[30px] font-medium tracking-tight">
            Félicitations ! Votre projet a été créé
          </h2>
          <p className="mb-8 text-center text-[15px] text-black/70">
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
    <StepperWrapper currentStep={3} method="github">
      <StepThreeForm />
    </StepperWrapper>
  );
}
