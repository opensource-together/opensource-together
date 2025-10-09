"use client";

import { useRouter, useSearchParams } from "next/navigation";

import StepperHeaderComponent from "@/features/projects/components/stepper/stepper-header.component";
import { StepperWrapper } from "@/features/projects/components/stepper/stepper-wrapper.component";

import FormNavigationButtons from "../../../components/stepper/stepper-navigation-buttons.component";
import { useProjectCreateStore } from "../../../stores/project-create.store";

export default function StepSuccessView() {
  const { formData } = useProjectCreateStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams.get("projectId");

  const currentStep = () => {
    if (formData.method === "scratch") {
      return 4;
    } else if (formData.method === "github" || formData.method === "gitlab") {
      return 5;
    }
  };

  // useEffect(() => {
  //   resetForm();
  // }, [resetForm]);

  return (
    <StepperWrapper currentStep={currentStep() || 4}>
      <StepperHeaderComponent
        title="Your project has been created !"
        description="You can now find your projects in your dashboard and contributer will be able to apply to any open roles."
      />

      <FormNavigationButtons
        onPrevious={() => router.push("/")}
        previousLabel="Return to Home"
        onNext={() => router.push(`/projects/${projectId}`)}
        nextLabel="View Project"
        isNextDisabled={false}
        nextType="button"
      />
    </StepperWrapper>
  );
}
