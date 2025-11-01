"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Modal } from "@/shared/components/ui/modal";

import StepperHeaderComponent from "@/features/projects/components/stepper/stepper-header.component";
import { StepperWrapper } from "@/features/projects/components/stepper/stepper-wrapper.component";

import FormNavigationButtons from "../../../components/stepper/stepper-navigation-buttons.component";
import {
  useProject,
  useToggleProjectPublished,
} from "../../../hooks/use-projects.hook";
import { useProjectCreateStore } from "../../../stores/project-create.store";

export default function StepSuccessView() {
  const { resetForm } = useProjectCreateStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams.get("projectId") || "";
  const [isPublishDialogOpen, setPublishDialogOpen] = useState(false);

  const { data: project } = useProject(projectId);
  const { toggleProjectPublished, isTogglingPublished } =
    useToggleProjectPublished();

  useEffect(() => {
    resetForm();
    return () => resetForm();
  }, [resetForm]);

  const handleReturnToDashboard = () => {
    router.replace("/dashboard/my-projects");
  };

  const handlePublishProject = () => {
    setPublishDialogOpen(true);
  };

  const handleConfirmPublish = () => {
    if (project) {
      toggleProjectPublished(
        { project, published: true },
        {
          onSuccess: () => {
            setPublishDialogOpen(false);
            router.replace(`/projects/${projectId}`);
          },
        }
      );
    }
  };

  const handleCancelPublish = () => {
    setPublishDialogOpen(false);
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
        onNext={handlePublishProject}
        nextLabel="Publish Project"
        isNextDisabled={false}
        nextType="button"
      />
      <Modal
        open={isPublishDialogOpen}
        onOpenChange={setPublishDialogOpen}
        title="Publish project?"
        description="Once published, your project becomes visible to everyone. You can unpublish later."
        isLoading={isTogglingPublished}
        onConfirm={handleConfirmPublish}
        onCancel={handleCancelPublish}
        confirmText="Publish"
      />
    </StepperWrapper>
  );
}
