"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/components/ui/button";

import {
  type ProjectCreateMethod,
  useProjectCreateStore,
} from "../../stores/project-create.store";

export default function StepZeroView() {
  const router = useRouter();
  const { setMethod } = useProjectCreateStore();

  const handleMethodSelection = (method: ProjectCreateMethod) => {
    setMethod(method);
    router.push(`/projects/create/${method}/step-one`);
  };

  return (
    <div className="mx-auto mt-8 max-w-2xl">
      <div className="mt-[100px] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center p-10">
          <h2 className="mb-2 text-3xl font-medium">
            Choisissez votre méthode
          </h2>
          <p className="mb-8 text-black/70">
            Importez un repository Github ou créez un projet depuis zéro.
          </p>
          <Button
            size="lg"
            className="mb-4 flex w-full items-center justify-center"
            onClick={() => handleMethodSelection("github")}
          >
            Importer depuis Github{" "}
            <span className="">
              <Image
                src="/icons/github.svg"
                alt="github-icon"
                width={18}
                height={18}
                className="invert"
              />
            </span>
          </Button>
          <div className="mb-2 text-sm text-black/70">ou</div>
          <Button
            variant="outline"
            size="lg"
            className="w-full items-center justify-center"
            onClick={() => handleMethodSelection("scratch")}
          >
            Créer un projet depuis zéro
          </Button>
        </div>
      </div>
    </div>
  );
}
