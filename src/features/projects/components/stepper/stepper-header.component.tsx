"use client";

import StepperIndicator from "./stepper-indicator.component";

interface StepperHeaderComponentProps {
  title: string;
  description: string;
  currentStep?: number;
  totalSteps?: number;
  className?: string;
  onStepChange?: (step: number) => void;
}

export default function StepperHeaderComponent({
  title,
  description,
  currentStep,
  totalSteps,
  className,
  onStepChange,
}: StepperHeaderComponentProps) {
  return (
    <>
      <div className="flex min-w-xs flex-col">
        <StepperIndicator
          currentStep={currentStep || 0}
          totalSteps={totalSteps || 0}
          className={className}
          onStepChange={onStepChange}
        />
      </div>
      <div className="mx-auto flex flex-col">{/* Stepper Indicator */}</div>
      <h2 className="mb-2 text-3xl">{title}</h2>
      <p className="mb-4 text-muted-foreground text-sm">{description}</p>
    </>
  );
}
