"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import StepperHeaderComponent from "@/features/projects/components/stepper/stepper-header.component";
import { StepperWrapper } from "@/features/projects/components/stepper/stepper-wrapper.component";
import { Modal } from "@/shared/components/ui/modal";
import { getErrorMessage } from "@/shared/lib/get-error-message";

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
  const toggleProjectPublishedMutation = useToggleProjectPublished();

  useEffect(() => {
    resetForm();
    return () => resetForm();
  }, [resetForm]);

  const handleViewProject = () => {
    router.replace(`/projects/${projectId}`);
  };

  const handlePublishProject = () => {
    setPublishDialogOpen(true);
  };

  const handleConfirmPublish = async () => {
    if (!project) return;

    try {
      await toggleProjectPublishedMutation.mutateAsync({
        project,
        published: true,
      });
      toast.success("Project published");
      setPublishDialogOpen(false);
      router.replace(`/projects/${projectId}`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to publish project"));
    }
  };

  const handleCancelPublish = () => {
    setPublishDialogOpen(false);
  };

  return (
    <StepperWrapper>
      <StepperHeaderComponent
        title="Your project has been created"
        description="You can now find your projects in your dashboard, and contributors will be able to see your project."
      />
      <FormNavigationButtons
        onPrevious={handleViewProject}
        previousLabel="View Project"
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
        isLoading={toggleProjectPublishedMutation.isPending}
        onConfirm={() => void handleConfirmPublish()}
        onCancel={handleCancelPublish}
        confirmText="Publish"
      />
    </StepperWrapper>
  );
}
