import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/icon";

export default function PublicProfileEmpty() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center text-center">
        {/* Icône */}
        <div className="mb-6">
          <Icon name="user" size="2xl" variant="gray" />
        </div>

        {/* Titre */}
        <h1 className="mb-4 text-3xl font-normal text-black">
          Profil non trouvé
        </h1>

        {/* Description */}
        <p className="mb-8 max-w-md text-sm text-black/50">
          L'utilisateur que vous recherchez n'existe pas ou n'est pas
          accessible. Il se peut que le profil ait été supprimé ou que l'URL
          soit incorrecte.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/">
            <Button>Retour à l'accueil</Button>
          </Link>

          <Link href="/dashboard">
            <Button variant="secondary">Retour au Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
