"use client";

import { StepperWrapper } from "@/features/projects/components/stepper/stepper-wrapper.component";
import { StepFourForm } from "@/features/projects/forms/scratch/step-four.form";

export default function StepFourView() {
  return (
    <StepperWrapper currentStep={4} method="scratch">
      <div className="flex w-[600px] flex-col items-center rounded-lg bg-white p-10">
        <h2 className="mb-2 text-3xl font-medium text-black">
          Récapitulatif du projet
        </h2>
        <p className="mb-8 text-center text-sm text-black/70">
          Vérifiez les informations de votre projet avant de le publier
        </p>

        <StepFourForm />
      </div>
    </StepperWrapper>
  );
}
