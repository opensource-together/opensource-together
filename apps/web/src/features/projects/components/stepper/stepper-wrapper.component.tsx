"use client";

import React from "react";

import { ProjectCreateMethod } from "../../stores/project-create.store";
import StepperIndicatorComponent from "./stepper-indicator.component";

interface StepperWrapperProps {
  currentStep: number;
  method: ProjectCreateMethod;
  children: React.ReactNode;
}

export function StepperWrapper({ currentStep, children }: StepperWrapperProps) {
  return (
    <div className="mx-auto mt-8 max-w-2xl">
      <div className="mt-[100px] flex flex-col items-center justify-center">
        <StepperIndicatorComponent
          currentStep={currentStep}
          totalSteps={4}
          className="mb-10 w-fit"
        />
        {children}
      </div>
    </div>
  );
}
