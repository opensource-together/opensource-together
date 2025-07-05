"use client";

import StepperHeaderComponent from "@/features/projects/components/stepper/stepper-header.component";
import { StepperWrapper } from "@/features/projects/components/stepper/stepper-wrapper.component";
import { StepFourForm } from "@/features/projects/forms/step-four.form";

export default function StepFourView() {
  return (
    <StepperWrapper currentStep={4} method="scratch">
      <StepperHeaderComponent
        title="Récapitulatif du projet"
        description="Vérifiez les informations de votre projet avant de le publier"
      />
      <StepFourForm />
    </StepperWrapper>
  );
}
