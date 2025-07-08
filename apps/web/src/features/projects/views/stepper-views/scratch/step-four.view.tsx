"use client";

import StepperHeaderComponent from "@/features/projects/components/stepper/stepper-header.component";
import { StepperWrapper } from "@/features/projects/components/stepper/stepper-wrapper.component";
import { StepFourForm } from "@/features/projects/forms/scratch/step-four.form";

export default function StepFourView() {
  return (
    <StepperWrapper currentStep={4} method="scratch">
      <StepperHeaderComponent
        title="Ajoutez des liens externes"
        description="Ajoutez des liens externes pour que les utilisateurs puissent en savoir plus sur votre projet"
      />
      <StepFourForm />
    </StepperWrapper>
  );
}
