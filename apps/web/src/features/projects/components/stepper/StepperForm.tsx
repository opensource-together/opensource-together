import React, { useState } from "react";
import StepFour from "./StepFour";
import StepOne from "./StepOne";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
} from "./stepper";
import StepThree from "./StepThree";
import StepTwo from "./StepTwo";

const steps = [
  { label: "Choose your Method" },
  { label: "Step 2" },
  { label: "Step 3" },
  { label: "Step 4" },
];

export default function StepperForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepTwoMode, setStepTwoMode] = useState<"import" | "scratch">(
    "import",
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepOne
            onNext={(mode) => {
              setStepTwoMode(mode);
              setCurrentStep(1);
            }}
          />
        );
      case 1:
        return <StepTwo onNext={() => setCurrentStep(2)} mode={stepTwoMode} />;
      case 2:
        return <StepThree onNext={() => setCurrentStep(3)} />;
      case 3:
        return <StepFour onBack={() => setCurrentStep(2)} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-[100px]">
      {/* Nouveau Stepper shadcn */}
      <Stepper
        value={currentStep}
        onValueChange={setCurrentStep}
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
      {renderStep()}
    </div>
  );
}
