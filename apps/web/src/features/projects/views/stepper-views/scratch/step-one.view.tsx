"use client";

import StepperHeaderComponent from "@/features/projects/components/stepper/stepper-header.component";

import { StepperWrapper } from "../../../components/stepper/stepper-wrapper.component";
import { StepOneForm } from "../../../forms/scratch/step-one.form";

export default function StepOneView() {
  return (
    <StepperWrapper currentStep={1} method="scratch">
      <StepperHeaderComponent
        title="Renseignez vos informations"
        description="Renseignez les informations de base de votre projet open source"
      />
      <StepOneForm />
    </StepperWrapper>
  );
}
