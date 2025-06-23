"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/components/ui/button";

import { StepperWrapper } from "../../../components/stepper/stepper-wrapper.component";
import { useProjectCreateStore } from "../../../stores/project-create.store";

export default function StepTwoView() {
  const router = useRouter();
  const { formData } = useProjectCreateStore();

  const handleNext = () => {
    router.push("/projects/create/github/step-three");
  };

  if (!formData.selectedRepository) {
    // Redirect back if no repository selected
    router.replace("/projects/create/github/step-one");
    return null;
  }

  return (
    <StepperWrapper currentStep={2} method="github">
      <div className="flex flex-col items-center rounded-[20px] bg-white p-10">
        <h2 className="font-geist mb-2 text-[30px] font-medium text-black">
          Confirmer vos informations Github
        </h2>
        <p className="mb-8 text-center text-[15px] text-black/70">
          Vérifiez les informations du repository avant de continuer
        </p>
        <div className="mb-9 h-full w-[425px] rounded-[10px] border border-black/10 bg-black/3 p-5">
          {/* Name */}
          <div className="mb-4">
            <div className="mb-1 flex items-center gap-1">
              <span className="font-geist text-[16px] font-medium text-black/70">
                Nom
              </span>
              <Image
                src="/icons/writing-icon.svg"
                alt="writing-icon"
                width={13}
                height={13}
              />
            </div>
            <div className="font-geist mb-3 text-[12px] font-normal text-black/50">
              {formData.selectedRepository.name}
            </div>
          </div>
          {/* Dotted border */}
          <div className="my-4 border-t-2 border-dashed border-black/5" />
          {/* Description */}
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="font-geist text-[16px] font-medium text-black/70">
                  Description
                </span>
                <Image
                  src="/icons/writing-icon.svg"
                  alt="writing-icon"
                  width={13}
                  height={13}
                />
              </div>
              <span className="text-[10px] font-normal text-black/10">
                250/250
              </span>
            </div>
            <div className="font-geist mb-3 text-[12px] font-normal text-black/50">
              Nous, membres, contributeurs et leaders, nous nous engageons à
              faire de la participation à notre communauté une expérience sans
              harcèlement pour tous, quelle que soit l'âge, la taille, le
              handicap visible ou invisible, l'ethnicité, les caractéristiques
              sexuelles, l'identité et l'expression de genre, le niveau
              d'expérience, l'éducation, le statut socio-économique, la
              nationalité ...
            </div>
          </div>
          {/* Dotted border */}
          <div className="my-4 border-t-2 border-dashed border-black/5" />
          {/* Link to repository */}
          <div>
            <div className="mb-1 flex items-center gap-1">
              <span className="font-geist text-[16px] font-medium text-black/70">
                Lien vers le repository
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
              <span className="font-geist text-[12px] font-normal break-all text-black/50">
                https://github.com/opensource-together/
                {formData.selectedRepository.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}
              </span>
            </div>
          </div>
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
