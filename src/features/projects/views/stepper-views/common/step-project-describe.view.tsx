"use client";

import StepperHeaderComponent from "@/features/projects/components/stepper/stepper-header.component";

import { StepperWrapper } from "../../../components/stepper/stepper-wrapper.component";
import { StepDescribeProjectForm } from "../../../forms/stepper/common/step-describe-project.form";

export default function StepDescribeProjectView() {
  const currentStep = 3;
  const totalSteps = 4;

  return (
    <StepperWrapper className="lg:max-w-4xl">
      <StepperHeaderComponent
        title="Describe your project"
        description="Fill in the information in regards of your project below"
        currentStep={currentStep}
        totalSteps={totalSteps}
      />
      <StepDescribeProjectForm />
    </StepperWrapper>
  );
}
