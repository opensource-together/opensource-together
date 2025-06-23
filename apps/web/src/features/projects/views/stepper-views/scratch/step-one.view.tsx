"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";

import { StepperWrapper } from "../../../components/stepper-wrapper.component";
import { useProjectCreateStore } from "../../../store/project-create.store";

export default function StepOneView() {
  const router = useRouter();
  const { formData, updateProjectInfo } = useProjectCreateStore();

  // Local state for form inputs
  const [projectName, setProjectName] = useState(formData.projectName);
  const [description, setDescription] = useState(formData.description);
  const [website, setWebsite] = useState(formData.website);

  const handleNext = () => {
    // Save form data to store
    updateProjectInfo({
      projectName,
      description,
      website,
    });

    // Navigate to next step
    router.push("/projects/create/scratch/step-two");
  };

  return (
    <StepperWrapper currentStep={1} method="scratch">
      <div className="flex flex-col items-center p-10">
        <h2 className="mb-2 text-2xl font-medium">
          Renseignez les informations de votre projet
        </h2>
        <p className="mb-8 text-sm text-black/70">
          Renseignez les informations de votre projet open source ci-dessous
        </p>
        <form
          className="flex w-full flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleNext();
          }}
        >
          <div>
            <label className="mb-1 block font-medium tracking-tight text-black">
              Nom du projet
            </label>
            <input
              className="w-full rounded-md border border-black/10 px-3 py-2 text-sm focus:ring-2 focus:ring-black/10 focus:outline-none"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              maxLength={100}
            />
          </div>
          <div>
            <div className="mr-2 mb-1 flex items-center justify-between">
              <label className="font-medium tracking-tight text-black">
                Description
              </label>
              <span className="text-xs font-normal text-black/20">
                {description.length}/250
              </span>
            </div>
            <textarea
              className="w-full resize-none rounded-md border border-black/10 px-3 py-2 text-sm focus:ring-2 focus:ring-black/10 focus:outline-none"
              placeholder="Décrivez votre projet"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 250))}
              maxLength={250}
            />
          </div>
          <div>
            <label className="mb-1 block font-medium tracking-tight text-black">
              Lien vers le site web
            </label>
            <input
              className="w-full rounded-md border border-black/10 px-3 py-2 text-sm focus:ring-2 focus:ring-black/10 focus:outline-none"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <Button
            size="lg"
            className="flex items-center justify-center"
            type="submit"
          >
            Confirmer les informations et continuer
          </Button>
        </form>
      </div>
    </StepperWrapper>
  );
}
