"use client";

import { StepperWrapper } from "../../../components/stepper/stepper-wrapper.component";
import { StepOneForm } from "../../../forms/scratch/step-one.form";

export default function StepOneView() {
  return (
    <StepperWrapper currentStep={1} method="scratch">
      <div className="flex flex-col items-center rounded-lg bg-white p-10">
        <h2 className="mb-2 text-3xl font-medium text-black">
          Renseignez vos informations
        </h2>
        <p className="mb-8 text-center text-sm text-black/70">
          Renseignez les informations de base de votre projet open source
        </p>
        <StepOneForm />
      </div>
    </StepperWrapper>
  );
}
