"use client";

import StepperHeaderComponent from "@/features/projects/components/stepper/stepper-header.component";

import { StepperWrapper } from "../../../components/stepper/stepper-wrapper.component";
import { StepTwoForm } from "../../../forms/scratch/step-two-form";

export default function StepTwoView() {
  return (
    <StepperWrapper currentStep={2} method="scratch">
      <StepperHeaderComponent
        title="Ajoutez des technologies & catégories"
        description="Ajoutez des technologies et catégories pour votre projet open source"
      />
      <StepTwoForm />
    </StepperWrapper>
  );
}
