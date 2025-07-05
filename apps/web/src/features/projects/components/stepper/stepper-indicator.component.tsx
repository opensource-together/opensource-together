"use client";

interface StepperIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
  onStepChange?: (step: number) => void;
}

export function StepperIndicatorComponent({
  currentStep,
  totalSteps,
  className,
  onStepChange,
}: StepperIndicatorProps) {
  return (
    <div className={`mx-auto min-w-md space-y-8 text-center ${className}`}>
      <div className="space-y-3">
        <div className="bg-border flex h-2 w-full overflow-hidden rounded-full">
          {Array.from({ length: totalSteps }, (_, index) => {
            const step = index + 1;
            const isCompleted = step <= currentStep;

            return (
              <div
                key={step}
                className={`h-full flex-1 transition-colors duration-200 ${
                  isCompleted ? "bg-primary" : "bg-border"
                } ${onStepChange ? "cursor-pointer" : ""}`}
                onClick={() => onStepChange?.(step)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StepperIndicatorComponent;
