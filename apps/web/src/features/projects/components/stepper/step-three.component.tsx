import Image from "next/image";

import { Button } from "@/shared/components/ui/button";

/**
 * Renders a confirmation step for reviewing static Github project information and proceeding to the next step.
 *
 * Displays the project name, description, and repository link in a styled layout, and provides a button to confirm and continue.
 *
 * @param onNext - Callback invoked when the user confirms the information.
 */
export default function StepThree({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-[20px] bg-white p-10">
      <h2 className="font-geist mb-2 text-[30px] font-medium text-black">
        Confirmer vos informations Github
      </h2>
      <p className="mb-8 text-center text-[15px] text-black/70">
        Choisissez si vous souhaitez importer un repository Github ou créer un
        projet depuis zéro
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
            OpenSource Together
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
            Nous, membres, contributeurs et leaders, nous nous engageons à faire
            de la participation à notre communauté une expérience sans
            harcèlement pour tous, quelle que soit l'âge, la taille, le handicap
            visible ou invisible, l'ethnicité, les caractéristiques sexuelles,
            l'identité et l'expression de genre, le niveau d'expérience,
            l'éducation, le statut socio-économique, la nationalité ...
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
              https://github.com/opensource-together/opensource-together
            </span>
          </div>
        </div>
      </div>
      <Button
        size="lg"
        className="flex items-center justify-center"
        onClick={onNext}
      >
        Confirmer les informations
      </Button>
    </div>
  );
}
