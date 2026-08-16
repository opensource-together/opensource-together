"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaGithub, FaGitlab } from "react-icons/fa6";
import { toast } from "sonner";

import { useLinkSocialAccountMutation } from "@/features/auth/hooks/auth.mutations";
import { useCurrentUserQuery } from "@/features/auth/hooks/auth.queries";
import { getErrorMessage } from "@/shared/lib/get-error-message";

import ChooseMethodCard from "../../../components/stepper/choose-method-card.component";
import { FormNavigationButtons } from "../../../components/stepper/stepper-navigation-buttons.component";
import {
  type provider,
  useProjectCreateStore,
} from "../../../stores/project-create.store";

export default function StepIntroductionView() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<provider | null>(null);
  const { setMethod } = useProjectCreateStore();
  const currentUser = useCurrentUserQuery().data;
  const linkAccountMutation = useLinkSocialAccountMutation();

  const isGithubConnected =
    currentUser?.connectedProviders?.includes("github") || false;
  const isGitlabConnected =
    currentUser?.connectedProviders?.includes("gitlab") || false;

  const handleMethodSelection = (method: provider) => {
    setSelectedMethod(method);
  };

  const handleLinkProvider = async (provider: "github" | "gitlab") => {
    try {
      await linkAccountMutation.mutateAsync({
        provider,
        callbackURL: `${window.location.origin}/projects/create`,
      });
    } catch (error) {
      toast.error(
        getErrorMessage(error, `Unable to link your ${provider} account`)
      );
    }
  };

  const handleNext = () => {
    if (selectedMethod) {
      setMethod(selectedMethod);
      router.push(`/projects/create/${selectedMethod}/import`);
    }
  };

  return (
    <div className="mx-7 mt-8 max-w-2xl sm:mx-auto">
      <div className="mt-[100px] flex flex-col items-center justify-center">
        <div className="flex flex-col sm:items-start">
          <h2 className="mb-2 text-2xl tracking-[-0.04em]">
            Choose your Method
          </h2>
          <p className="text-muted-foreground text-sm">
            Import a repository from GitHub or GitLab to get started.
          </p>

          <div className="my-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            <ChooseMethodCard
              icon={FaGithub}
              title="GitHub"
              description="Import a repository from Github"
              isSelected={selectedMethod === "github"}
              isDisabled={!isGithubConnected}
              isLinking={linkAccountMutation.isPending}
              onClick={() => handleMethodSelection("github")}
              onLinkClick={() => void handleLinkProvider("github")}
            />
            <ChooseMethodCard
              icon={FaGitlab}
              title="GitLab"
              description="Import a repository from Gitlab"
              isSelected={selectedMethod === "gitlab"}
              isDisabled={!isGitlabConnected}
              isLinking={linkAccountMutation.isPending}
              onClick={() => handleMethodSelection("gitlab")}
              onLinkClick={() => void handleLinkProvider("gitlab")}
            />
          </div>
          <FormNavigationButtons
            onPrevious={() => router.push("/dashboard/my-projects")}
            onNext={handleNext}
            previousLabel="Exit"
            nextLabel="Continue"
            isNextDisabled={!selectedMethod}
            nextType="button"
          />
        </div>
      </div>
    </div>
  );
}
