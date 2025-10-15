import { Metadata } from "next";
import { notFound } from "next/navigation";

import { provider } from "@/features/projects/stores/project-create.store";
import StepGitConfirmView from "@/features/projects/views/stepper-views/git/step-git-confirm.view";

interface StepConfirmPageProps {
  params: Promise<{
    provider: string;
  }>;
}

export async function generateMetadata({
  params,
}: StepConfirmPageProps): Promise<Metadata> {
  const { provider } = await params;

  const titles = {
    github: "Configure GitHub Project | OpenSource Together",
    gitlab: "Configure GitLab Project | OpenSource Together",
    scratch: "Configure Project | OpenSource Together",
  };

  return {
    title:
      titles[provider as keyof typeof titles] ||
      "Configure Project | OpenSource Together",
    description: "Configure the details of your project",
  };
}

export default async function ProviderStepConfirmPage({
  params,
}: StepConfirmPageProps) {
  const { provider } = await params;

  const validProviders = ["github", "gitlab"];
  if (!validProviders.includes(provider)) {
    notFound();
  }

  return <StepGitConfirmView provider={provider as provider} />;
}
