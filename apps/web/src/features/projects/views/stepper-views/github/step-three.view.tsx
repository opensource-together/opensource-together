"use client";

import StepperHeaderComponent from "@/features/projects/components/stepper/stepper-header.component";

import { StepperWrapper } from "../../../components/stepper/stepper-wrapper.component";
import { StepThreeForm } from "../../../forms/github/step-three.form";

export default function StepThreeView() {
  return (
    <StepperWrapper currentStep={3} method="github">
      <StepperHeaderComponent
        title="Renseignez vos informations"
        description="Renseignez les informations de base de votre projet open source"
      />
      <StepThreeForm />
    </StepperWrapper>
  );
}
