"use client";

import React from "react";

import { ProjectCreateMethod } from "../../stores/project-create.store";
import StepperIndicatorComponent from "./stepper-indicator.component";

interface StepperWrapperProps {
  currentStep: number;
  method: ProjectCreateMethod;
  children: React.ReactNode;
}

export function StepperWrapper({
  currentStep,
  method,
  children,
}: StepperWrapperProps) {
  const totalSteps = method === "github" ? 6 : 4;

  return (
    <div className="mx-auto mt-8 max-w-md">
      <div className="my-24 flex flex-col items-center justify-center">
        <StepperIndicatorComponent
          currentStep={currentStep}
          totalSteps={totalSteps}
          className="mb-20"
        />
        {children}
      </div>
    </div>
  );
}
