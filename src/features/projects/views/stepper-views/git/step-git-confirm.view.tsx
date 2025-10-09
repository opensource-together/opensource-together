"use client";

import StepperHeaderComponent from "@/features/projects/components/stepper/stepper-header.component";

import { StepperWrapper } from "../../../components/stepper/stepper-wrapper.component";
import StepTwoForm from "../../../forms/stepper/git/step-git-confirm.form";
import { provider } from "../../../stores/project-create.store";

interface StepTwoViewProps {
  provider: provider;
}

export default function StepTwoView({ provider }: StepTwoViewProps) {
  const getProviderTitle = () => {
    switch (provider) {
      case "github":
        return "Confirm your Github information";
      case "gitlab":
        return "Confirm your GitLab information";
      default:
        return "Confirm your project information";
    }
  };

  const getProviderDescription = () => {
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
      <StepTwoForm provider={provider} />
    </StepperWrapper>
  );
}
