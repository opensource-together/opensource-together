import React from "react";

interface StepperIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
  onStepChange?: (step: number) => void;
}

export default function StepperIndicator({
  currentStep,
  totalSteps,
  className,
  onStepChange,
}: StepperIndicatorProps) {
  return (
    <div className={`mb-10 space-y-8 text-center ${className}`}>
      <div className="space-y-3">
        <div className="flex items-center gap-1">
          {Array.from({ length: totalSteps || 0 }, (_, index) => {
            const step = index + 1;
            const isCompleted = step <= (currentStep || 0);

            return (
              <React.Fragment key={step}>
                <div
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${
                    isCompleted ? "bg-primary" : "bg-muted"
                  } ${onStepChange ? "cursor-pointer" : ""}`}
                  onClick={() => onStepChange?.(step)}
                />
                {index < (totalSteps || 0) - 1 && <div className="w-1" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
