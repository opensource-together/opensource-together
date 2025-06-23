"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/components/ui/button";

import { StepperWrapper } from "../../../components/stepper-wrapper.component";
import { useProjectCreateStore } from "../../../store/project-create.store";

export default function StepTwoView() {
  const router = useRouter();
  const { formData } = useProjectCreateStore();

  const handleNext = () => {
    router.push("/projects/create/scratch/step-three");
  };

  return (
    <StepperWrapper currentStep={2} method="scratch">
      <div className="flex flex-col items-center p-10">
        <h2 className="mb-2 text-2xl font-medium">
          Confirmer vos informations
        </h2>
        <p className="mb-8 text-sm text-black/70">
          Vérifiez les informations de votre projet avant de continuer
        </p>
        <div className="mb-9 h-full w-full rounded-lg border border-black/10 bg-black/3 p-5">
          {/* Name */}
          <div className="mb-4">
            <div className="mb-1 flex items-center gap-1">
              <span className="text-sm font-medium text-black/70">Nom</span>
              <Image
                src="/icons/writing-icon.svg"
                alt="writing-icon"
                width={13}
                height={13}
              />
            </div>
            <div className="mb-3 text-sm font-normal text-black/50">
              {formData.projectName || "Nom du projet"}
            </div>
          </div>
          {/* Dotted border */}
          <div className="my-4 border-t-2 border-dashed border-black/5" />
          {/* Description */}
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-black/70">
                  Description
                </span>
                <Image
                  src="/icons/writing-icon.svg"
                  alt="writing-icon"
                  width={13}
                  height={13}
                />
              </div>
              <span className="text-xs font-normal text-black/10">
                {formData.description.length}/250
              </span>
            </div>
            <div className="mb-3 text-xs font-normal text-black/50">
              {formData.description || "Description du projet"}
            </div>
          </div>
          {/* Dotted border */}
          <div className="my-4 border-t-2 border-dashed border-black/5" />
          {/* Website Link */}
          {formData.website && (
            <div>
              <div className="mb-1 flex items-center gap-1">
                <span className="text-sm font-medium text-black/70">
                  Lien vers le site web
                </span>
                <Image
                  src="/icons/writing-icon.svg"
                  alt="writing-icon"
                  width={13}
                  height={13}
                />
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/icons/link-icon.svg"
                  alt="link-icon"
                  width={15}
                  height={15}
                />
                <span className="text-sm font-normal break-all text-black/50">
                  {formData.website}
                </span>
              </div>
            </div>
          )}
        </div>
        <Button
          size="lg"
          className="flex items-center justify-center"
          onClick={handleNext}
        >
          Confirmer les informations
        </Button>
      </div>
    </StepperWrapper>
  );
}
