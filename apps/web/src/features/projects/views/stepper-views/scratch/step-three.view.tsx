"use client";

import StepperHeaderComponent from "@/features/projects/components/stepper/stepper-header.component";

import { StepperWrapper } from "../../../components/stepper/stepper-wrapper.component";
import { StepThreeForm } from "../../../forms/step-three.form";

export default function StepThreeView() {
  return (
    <StepperWrapper currentStep={3} method="scratch">
      <StepperHeaderComponent
        title="Créez des rôles pour votre projet"
        description="Créez des rôles pour votre projet open source"
      />
      <StepThreeForm />
    </StepperWrapper>
  );
}
