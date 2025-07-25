"use client";

import StepperHeaderComponent from "@/features/projects/components/stepper/stepper-header.component";
import { StepFourForm } from "@/features/projects/forms/github/step-four.form";

import { StepperWrapper } from "../../../components/stepper/stepper-wrapper.component";

export default function StepFourView() {
  return (
    <StepperWrapper currentStep={4} method="github">
      <StepperHeaderComponent
        title="Ajoutez des technologies & catégories"
        description="Ajoutez des technologies et catégories pour votre projet open source"
      />
      <StepFourForm />
    </StepperWrapper>
  );
}
