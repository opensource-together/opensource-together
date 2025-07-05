"use client";

import StepperHeaderComponent from "@/features/projects/components/stepper/stepper-header.component";
import { StepperWrapper } from "@/features/projects/components/stepper/stepper-wrapper.component";
import { StepFourForm } from "@/features/projects/forms/scratch/step-four.form";
import { useCreateProject } from "@/features/projects/hooks/use-projects.hook";
import { useProjectCreateStore } from "@/features/projects/stores/project-create.store";

export default function StepFourView() {
  const { formData } = useProjectCreateStore();
  const { createProject, isCreating } = useCreateProject();

  const handleCreateProject = () => {
    console.log("=== VIEW: APPEL DU SERVICE ===");
    console.log("FormData à envoyer:", formData);
    createProject(formData);
  };

  return (
    <StepperWrapper currentStep={4} method="scratch">
      <StepperHeaderComponent
        title="Ajoutez des liens externes"
        description="Ajoutez des liens externes pour que les utilisateurs puissent en savoir plus sur votre projet"
      />
      <StepFourForm onSubmit={handleCreateProject} isLoading={isCreating} />
    </StepperWrapper>
  );
}
