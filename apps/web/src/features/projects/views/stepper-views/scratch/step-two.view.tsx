"use client";

import { StepperWrapper } from "../../../components/stepper/stepper-wrapper.component";
import { StepTwoForm } from "../../../forms/scratch/step-two-form";

export default function StepTwoView() {
  return (
    <StepperWrapper currentStep={2} method="scratch">
      <div className="flex flex-col items-center rounded-lg bg-white p-10 text-center">
        <h2 className="mb-2 text-3xl font-medium text-black">
          Ajoutez des informations supplémentaires
        </h2>
        <p className="mb-8 text-center text-sm text-black/70">
          Ajoutez des informations supplémentaires pour votre projet open source
        </p>
        <StepTwoForm />
      </div>
    </StepperWrapper>
  );
}
