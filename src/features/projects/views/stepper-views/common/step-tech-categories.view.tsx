"use client";

import StepperHeaderComponent from "@/features/projects/components/stepper/stepper-header.component";
import { StepTechCategoriesForm } from "@/features/projects/forms/stepper/common/step-tech-categories.form";
import { useProjectCreateStore } from "@/features/projects/stores/project-create.store";

import { StepperWrapper } from "../../../components/stepper/stepper-wrapper.component";

export default function StepTechCategoriesView() {
  const { formData } = useProjectCreateStore();
  const currentStep = () => {
    if (formData.method === "scratch") {
      return 2;
    } else if (formData.method === "github" || formData.method === "gitlab") {
      return 4;
    }
  };
  const totalSteps =
    formData.method === "github" ? 4 : formData.method === "gitlab" ? 4 : 2;

  return (
    <StepperWrapper className="lg:max-w-4xl">
      <StepperHeaderComponent
        title="Add technologies & categories"
        description="Complete very detail regarding your open source project"
        currentStep={currentStep() || 2}
        totalSteps={totalSteps}
      />
      <StepTechCategoriesForm />
    </StepperWrapper>
  );
}
