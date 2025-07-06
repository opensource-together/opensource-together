"use client";

import { useRouter } from "next/navigation";

import Icon from "@/shared/components/ui/icon";
import { Label } from "@/shared/components/ui/label";

import FormNavigationButtons from "../../components/stepper/stepper-navigation-buttons.component";
import { useProjectCreateStore } from "../../stores/project-create.store";

export default function StepTwoView() {
  const router = useRouter();
  const { formData } = useProjectCreateStore();

  const handlePrevious = () => router.push("/projects/create/github/step-one");

  const handleNext = () => router.push("/projects/create/github/step-three");

  return (
    <div className="w-full">
      <div className="mb-9 w-full rounded-xl border border-black/5 px-6 pt-7 pb-8">
        <div className="mb-4">
          <div className="mb-1 flex items-center gap-1">
            <Label className="text-lg">Nom du repository</Label>
          </div>
          <div className="text- mt-3 font-normal text-black/50">
            {formData.selectedRepository?.name}
          </div>
        </div>
        <div className="my-4 h-px border-t-2 border-black/5" />
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Label className="text-lg">README.md</Label>
            </div>
          </div>
          <div className="mb-3 line-clamp-5 text-xs leading-4 text-black/50">
            Nous, membres, contributeurs et leaders, nous nous engageons à faire
            de la participation à notre communauté une expérience sans
            harcèlement pour tous, quelle que soit l'âge, la taille, le handicap
            visible ou invisible, l'ethnicité, les caractéristiques sexuelles,
            l'identité et l'expression de genre, le niveau d'expérience,
            l'éducation, le statut socio-économique, la nationalité ...
          </div>
        </div>
        <div className="my-4 h-px border-t-2 border-black/5" />
        <div>
          <div className="mb-1 flex items-center gap-1">
            <Label className="text-lg">Lien vers le repository</Label>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="link" variant="gray" size="sm" />
            <span className="line-clamp-1 text-sm font-normal break-all text-black/50">
              https://github.com/opensource-together/
              {formData.selectedRepository?.name
                .toLowerCase()
                .replace(/\s+/g, "-")}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <FormNavigationButtons
          onNext={handleNext}
          onPrevious={handlePrevious}
          previousLabel="Retour"
          nextLabel="Confirmer"
        />
      </div>
    </div>
  );
}
