import { Metadata } from "next";
import { notFound } from "next/navigation";

import { provider } from "@/features/projects/stores/project-create.store";
import StepGitImportView from "@/features/projects/views/stepper-views/git/step-git-import.view";

interface StepImportPageProps {
  params: Promise<{
    provider: string;
  }>;
}

export async function generateMetadata({
  params,
}: StepImportPageProps): Promise<Metadata> {
  const { provider } = await params;

  const titles = {
    github: "Importer Github Repository | OpenSource Together",
    gitlab: "Importer GitLab Repository | OpenSource Together",
  };

  const descriptions = {
    github: "Choose which Github repository you want to import.",
    gitlab: "Choose which GitLab repository you want to import.",
  };

  return {
    title:
      titles[provider as keyof typeof titles] ||
      "Create Project | OpenSource Together",
    description:
      descriptions[provider as keyof typeof descriptions] ||
      "Create Project on OpenSource Together",
  };
}

export default async function ProviderStepImportPage({
  params,
}: StepImportPageProps) {
  const { provider } = await params;

  const validProviders = ["github", "gitlab"];
  if (!validProviders.includes(provider)) {
    notFound();
  }

  return <StepGitImportView provider={provider as provider} />;
}
