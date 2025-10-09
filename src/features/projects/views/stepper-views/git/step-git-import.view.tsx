"use client";

import StepperHeaderComponent from "@/features/projects/components/stepper/stepper-header.component";

import { StepperWrapper } from "../../../components/stepper/stepper-wrapper.component";
import StepGitImportForm from "../../../forms/stepper/git/step-git-import.form";
import { provider } from "../../../stores/project-create.store";

interface StepGitImportViewProps {
  provider: provider;
}

export default function StepGitImportView({
  provider,
}: StepGitImportViewProps) {
  const getProviderTitle = (): string => {
    switch (provider) {
      case "github":
        return "Import Github Repository";
      case "gitlab":
        return "Import GitLab Repository";
      case "scratch":
        return "Create Project from Scratch";
      default:
        return "Import Repository";
    }
  };

  const getProviderDescription = (): string => {
    switch (provider) {
      case "github":
        return "Choose which Github repository you want to import.";
      case "gitlab":
        return "Choose which GitLab repository you want to import.";
      case "scratch":
        return "Configure your project from scratch.";
      default:
        return "Choose which repository you want to import.";
    }
  };

  return (
    <StepperWrapper currentStep={1} method={provider}>
      <StepperHeaderComponent
        title={getProviderTitle()}
        description={getProviderDescription()}
      />
      <StepGitImportForm provider={provider} />
    </StepperWrapper>
  );
}
