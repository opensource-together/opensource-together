"use client";

import StepperHeaderComponent from "@/features/projects/components/stepper/stepper-header.component";
import { useProjectCreateStore } from "@/features/projects/stores/project-create.store";

import { StepperWrapper } from "../../../components/stepper/stepper-wrapper.component";
import { StepDescribeProjectForm } from "../../../forms/stepper/common/step-describe-project.form";

export default function StepDescribeProjectView() {
  const { formData } = useProjectCreateStore();

  const currentStep = () => {
    if (formData.method === "scratch") {
      return 1;
    } else if (formData.method === "github" || formData.method === "gitlab") {
      return 2;
    }
  };

  return (
    <StepperWrapper currentStep={currentStep() || 1}>
      <StepperHeaderComponent
        title="Describe your project"
        description="Fill in the information in regards of your project below"
      />
      <StepDescribeProjectForm />
    </StepperWrapper>
  );
}
