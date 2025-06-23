"use client";

import React from "react";

import { type ProjectCreateMethod } from "../store/project-create.store";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
} from "./stepper/stepper.component";

interface StepperWrapperProps {
  currentStep: number;
  method: ProjectCreateMethod;
  children: React.ReactNode;
}

const steps = [
  { label: "Choisissez votre méthode" },
  { label: "Renseignez les informations de votre projet" },
  { label: "Renseignez les rôles de votre projet" },
  { label: "Confirmez les informations de votre projet" },
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
        <Stepper
          value={currentStep}
          orientation="horizontal"
          className="mb-10 w-fit"
        >
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <StepperItem step={idx}>
                <StepperIndicator />
              </StepperItem>
              {idx < steps.length - 1 && (
                <StepperSeparator
                  className={currentStep > idx ? "bg-black" : "bg-black/5"}
                />
              )}
            </React.Fragment>
          ))}
        </Stepper>

        {/* Step Content */}
        {children}
      </div>
    </div>
  );
}
