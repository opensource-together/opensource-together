"use client";

import StepperHeaderComponent from "@/features/projects/components/stepper/stepper-header.component";

import { StepperWrapper } from "../../../components/stepper/stepper-wrapper.component";
import { StepFiveForm } from "../../../forms/github/step-five.form";

export default function StepFiveView() {
  return (
    <StepperWrapper currentStep={5} method="github">
      <StepperHeaderComponent
        title="Créez des rôles pour votre projet"
        description="Créez des rôles pour votre projet open source"
      />
      <StepFiveForm />
    </StepperWrapper>
  );
}
