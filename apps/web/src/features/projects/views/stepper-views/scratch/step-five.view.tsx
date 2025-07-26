"use client";

import StepperHeaderComponent from "@/features/projects/components/stepper/stepper-header.component";
import StepFiveForm from "@/features/projects/forms/scratch/step-five.form";
import { StepperWrapper } from "../../../components/stepper/stepper-wrapper.component";

export default function StepFiveView() {
  return (
    <StepperWrapper currentStep={5} method="scratch">
      <StepperHeaderComponent
        title="README du Projet"
        description="Ajoutez une documentation détaillée pour votre projet"
      />
      <StepFiveForm />
    </StepperWrapper>
  );
}