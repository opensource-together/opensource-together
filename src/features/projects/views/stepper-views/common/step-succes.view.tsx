"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import StepperHeaderComponent from "@/features/projects/components/stepper/stepper-header.component";
import { StepperWrapper } from "@/features/projects/components/stepper/stepper-wrapper.component";

import FormNavigationButtons from "../../../components/stepper/stepper-navigation-buttons.component";
import { useProjectCreateStore } from "../../../stores/project-create.store";

export default function StepSuccessView() {
  const { resetForm } = useProjectCreateStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams.get("projectId");

  useEffect(() => {
    resetForm();
    return () => resetForm();
  }, [resetForm]);

  const handleReturnToDashboard = () => {
    router.replace("/dashboard/my-projects");
  };

  const handleViewProject = () => {
    router.replace(`/projects/${projectId}`);
  };

  return (
    <StepperWrapper>
      <StepperHeaderComponent
        title="Your project has been created !"
        description="You can now find your projects in your dashboard and contributer will be able to see your project."
      />
      <FormNavigationButtons
        onPrevious={handleReturnToDashboard}
        previousLabel="Return to dashboard"
        onNext={handleViewProject}
        nextLabel="View Project"
        isNextDisabled={false}
        nextType="button"
      />
    </StepperWrapper>
  );
}
