"use client";

import { StepperWrapper } from "../../../components/stepper/stepper-wrapper.component";
import { StepThreeForm } from "../../../forms/step-three.form";

export default function StepThreeView() {
  return (
    <StepperWrapper currentStep={3} method="scratch">
      <div className="flex flex-col items-center rounded-lg bg-white p-10 text-center">
        <h2 className="mb-2 text-3xl font-medium text-black">
          Ajoutez des rôles pour votre projet
        </h2>
        <p className="mb-8 text-center text-sm text-black/70">
          Ajoutez des rôles pour votre projet open source
        </p>
        <StepThreeForm />
      </div>
    </StepperWrapper>
  );
}
