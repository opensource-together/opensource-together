"use client";

import StepperHeaderComponent from "@/features/projects/components/stepper/stepper-header.component";

import { StepperWrapper } from "../../../components/stepper/stepper-wrapper.component";
import StepGitConfirmForm from "../../../forms/stepper/git/step-git-confirm.form";
import { provider } from "../../../stores/project-create.store";

interface StepGitConfirmViewProps {
  provider: provider;
}

export default function StepGitConfirmView({
  provider,
}: StepGitConfirmViewProps) {
  const getProviderTitle = (): string => {
    switch (provider) {
      case "github":
        return "Confirm your Github information";
      case "gitlab":
        return "Confirm your GitLab information";
      default:
        return "Confirm your project information";
    }
  };

  const getProviderDescription = (): string => {
    switch (provider) {
      case "github":
        return "Configure the details of your GitHub project.";
      case "gitlab":
        return "Configure the details of your GitLab project.";
      default:
        return "Configure the details of your project.";
    }
  };

  return (
    <StepperWrapper currentStep={2} method={provider}>
      <StepperHeaderComponent
        title={getProviderTitle()}
        description={getProviderDescription()}
      />
      <StepGitConfirmForm provider={provider} />
    </StepperWrapper>
  );
}
