"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/shared/components/ui/button";

import { useProjectCreateStore } from "../../stores/project-create.store";

export default function StepSuccessView() {
  const { resetForm } = useProjectCreateStore();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  return (
    <div className="mx-auto mt-42 max-w-lg">
      <div className="mx-7 flex flex-col items-center justify-center gap-6 text-center tracking-tighter md:mx-auto">
        <h1 className="text-2xl font-medium md:text-3xl">
          Félicitations ! Votre projet a été créé
        </h1>
        <p className="text-black/70">
          Vous pouvez maintenant trouver vos projets dans votre tableau de bord
          « Mes projets » et les membres pourront postuler à tous les rôles
          ouverts.{" "}
        </p>
        <Link
          href={projectId ? `/projects/${projectId}` : "/"}
          className="w-10/12"
        >
          <Button size="lg" className="w-full">
            Voir le projet
          </Button>
        </Link>
      </div>
    </div>
  );
}
