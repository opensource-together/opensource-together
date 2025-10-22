"use client";

import StepperHeaderComponent from "@/features/projects/components/stepper/stepper-header.component";
import { StepTechCategoriesForm } from "@/features/projects/forms/stepper/common/step-tech-categories.form";

import { StepperWrapper } from "../../../components/stepper/stepper-wrapper.component";

export default function StepTechCategoriesView() {
  const currentStep = 4;
  const totalSteps = 4;

  return (
    <StepperWrapper className="lg:max-w-3xl">
      <StepperHeaderComponent
        title="Add technologies & categories"
        description="Complete very detail regarding your open source project"
        currentStep={currentStep}
        totalSteps={totalSteps}
      />
      <StepTechCategoriesForm />
    </StepperWrapper>
  );
}
