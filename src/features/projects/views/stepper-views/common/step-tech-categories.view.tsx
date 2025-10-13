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
  return (
    <StepperWrapper currentStep={currentStep() || 2} method={formData.method}>
      <StepperHeaderComponent
        title="Add technologies & categories"
        description="Complete very detail regarding your open source project"
      />
      <StepTechCategoriesForm />
    </StepperWrapper>
  );
}
