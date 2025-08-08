"use client";

import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import Icon from "@/shared/components/ui/icon";
import { Label } from "@/shared/components/ui/label";

import FormNavigationButtons from "../../components/stepper/stepper-navigation-buttons.component";
import { useProjectCreateStore } from "../../stores/project-create.store";

export default function StepTwoForm() {
  const router = useRouter();
  const { formData, updateProjectInfo } = useProjectCreateStore();

  const handlePrevious = () => router.push("/projects/create/github/step-one");

  const handleNext = () => {
    if (formData.selectedRepository) {
      updateProjectInfo({
        title: formData.selectedRepository.title,
        shortDescription:
          formData.selectedRepository.readme ||
          "README à compléter pour ce projet.",
      });
    }
    router.push("/projects/create/github/step-three");
  };

  return (
    <div className="w-full">
      <div className="mb-9 w-full rounded-xl border border-black/5 px-6 pt-7 pb-8">
        <div className="mb-4">
          <div className="mb-1 flex items-center gap-1">
            <Label className="text-lg">Nom du repository</Label>
          </div>
          <div className="mt-2 font-normal text-black/50">
            {formData.selectedRepository?.title}
          </div>
        </div>
        <div className="my-4 h-px border-t-2 border-black/5" />
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Label className="text-lg">README.md</Label>
            </div>
          </div>
          <div className="mb-3 line-clamp-5 h-[100px] text-sm leading-6 text-black/50">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {formData.selectedRepository?.readme ||
                "Aucune description disponible. Vous pourrez en ajouter une à l'étape suivante."}
            </ReactMarkdown>
          </div>
        </div>
        <div className="my-4 h-px border-t-2 border-black/5" />
        <div>
          <div className="mb-1 flex items-center gap-1">
            <Label className="text-lg">Lien vers le repository</Label>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Icon name="link" variant="gray" size="sm" />
            <span className="line-clamp-1 text-sm font-normal break-all text-black/50">
              {formData.selectedRepository?.url}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <FormNavigationButtons
          onNext={handleNext}
          onPrevious={handlePrevious}
          previousLabel="Retour"
          nextLabel="Suivant"
          nextType="button"
        />
      </div>
    </div>
  );
}
