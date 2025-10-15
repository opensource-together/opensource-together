"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaGithub, FaGitlab } from "react-icons/fa6";
import { HiMiniSquare2Stack } from "react-icons/hi2";

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

  const handleMethodSelection = (method: provider) => {
    setSelectedMethod(method);
  };

  const handleNext = () => {
    if (selectedMethod) {
      setMethod(selectedMethod);
      if (selectedMethod === "scratch") {
        router.push("/projects/create/describe");
      } else {
        router.push(`/projects/create/${selectedMethod}/import`);
      }
    }
  };

  return (
    <div className="mx-7 mt-8 max-w-2xl sm:mx-auto">
      <div className="mt-[100px] flex flex-col items-center justify-center">
        <div className="flex flex-col sm:items-start">
          <h2 className="text-3xl font-medium">Choose your Method</h2>
          <p className="mt-2 text-sm text-black/70">
            Import a repository from Gitlab or Github or create project from
            scratch.{" "}
          </p>

          <div className="my-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            <ChooseMethodCard
              icon={FaGithub}
              title="GitHub"
              description="Import a repository from Github"
              isSelected={selectedMethod === "github"}
              onClick={() => handleMethodSelection("github")}
            />
            <ChooseMethodCard
              icon={HiMiniSquare2Stack}
              title="From Scratch"
              description="Create project from scratch"
              isSelected={selectedMethod === "scratch"}
              onClick={() => handleMethodSelection("scratch")}
            />
            <ChooseMethodCard
              icon={FaGitlab}
              title="GitLab"
              description="Import a repository from Gitlab"
              isSelected={selectedMethod === "gitlab"}
              onClick={() => handleMethodSelection("gitlab")}
            />
          </div>
          <FormNavigationButtons
            onPrevious={() => router.push("/dashboard/my-projects")}
            onNext={handleNext}
            nextLabel="Continue"
            isNextDisabled={!selectedMethod}
            nextType="button"
          />
        </div>
      </div>
    </div>
  );
}
