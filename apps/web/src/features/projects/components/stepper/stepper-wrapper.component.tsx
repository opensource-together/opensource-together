"use client";

import React from "react";

import { ProjectCreateMethod } from "../../stores/project-create.store";
import { SimpleStepper } from "./simple-stepper.component";

interface StepperWrapperProps {
  currentStep: number;
  method: ProjectCreateMethod;
  children: React.ReactNode;
}

const steps = [
  "Choisissez votre méthode",
  "Renseignez les informations de votre projet",
  "Renseignez les rôles de votre projet",
  "Confirmez les informations de votre projet",
];

export function StepperWrapper({
  currentStep,
  method,
  children,
}: StepperWrapperProps) {
  return (
    <div className="mx-auto mt-8 max-w-2xl">
      <div className="mt-[100px] flex flex-col items-center justify-center">
        {/* Stepper UI */}
        <SimpleStepper
          currentStep={currentStep}
          totalSteps={4}
          steps={steps}
          className="mb-10 w-fit"
        />

        {/* Step Content */}
        {children}
      </div>
    </div>
  );
}
