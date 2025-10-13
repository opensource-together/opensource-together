"use client";

import React from "react";

import { provider } from "../../stores/project-create.store";
import StepperIndicatorComponent from "./stepper-indicator.component";

interface StepperWrapperProps {
  currentStep: number;
  method?: provider;
  children: React.ReactNode;
}

export function StepperWrapper({
  currentStep,
  method,
  children,
}: StepperWrapperProps) {
  const totalSteps = method === "github" ? 4 : method === "gitlab" ? 4 : 2;

  return (
    <div className="mx-auto mt-8 max-w-md">
      <div className="my-24 flex flex-col items-start justify-start">
        <StepperIndicatorComponent
          currentStep={currentStep}
          totalSteps={totalSteps}
          className="mb-10"
        />
        {children}
      </div>
    </div>
  );
}
