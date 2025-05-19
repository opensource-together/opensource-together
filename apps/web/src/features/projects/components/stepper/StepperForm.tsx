import React, { useState } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";

const steps = [
  { label: "Choose your Method" },
  { label: "Step 2" },
  { label: "Step 3" },
  { label: "Step 4" },
];

export default function StepperForm() {
  const [currentStep, setCurrentStep] = useState(0);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepOne onNext={() => setCurrentStep(1)} />;
      case 1:
        return <StepTwo onNext={() => setCurrentStep(2)} onBack={() => setCurrentStep(0)} />;
      case 2:
        return <StepThree onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />;
      case 3:
        return <StepFour onBack={() => setCurrentStep(2)} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-[100px]">
      {/* Stepper */}
      <div className="flex items-center mb-10">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center rounded-full transition-colors duration-200
                  ${idx < currentStep ? "bg-black text-white" : ""}
                  ${idx === currentStep ? "bg-black text-white ring-2 ring-black/80" : ""}
                  ${idx > currentStep ? "bg-black/5 text-black" : ""}
                `}
                style={{ width: 25, height: 25 }}
              >
                <span className="text-[12px] font-medium">{idx + 1}</span>
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`h-[3px] w-[75px] mx-2 transition-colors duration-200
                  ${idx < currentStep ? "bg-black" : "bg-black/5"}
                `}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Step Content */}
      {renderStep()}
    </div>
  );
} 