import Link from "next/link";

import { Button } from "@/shared/components/ui/button";

export default function StepSuccessView() {
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
        <Link href="/" className="w-10/12">
          <Button size="lg" className="w-full">
            Voir le projet
          </Button>
        </Link>
      </div>
    </div>
  );
}
