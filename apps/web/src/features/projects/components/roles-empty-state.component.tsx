import { Button } from "@/shared/components/ui/button";
import Icon from "@/shared/components/ui/icon";

import CreateRoleForm from "../forms/create-role.form";

interface RolesEmptyStateProps {
  isMaintainer: boolean;
  projectId: string;
}

export default function RolesEmptyState({
  isMaintainer,
  projectId,
}: RolesEmptyStateProps) {
  return (
    <div className="mx-auto flex w-[400px] flex-col items-center justify-center py-12 text-center">
      <h3 className="mb-3 text-lg font-medium tracking-tighter text-black">
        Aucun Rôle Disponible
      </h3>
      <p className="mb-6 text-sm font-normal tracking-tighter text-black/70">
        {isMaintainer
          ? "Aucun rôle n'a été soumis pour ce projet pour le moment. Les rôles apparaîtront ici une fois créés."
          : "Ce projet n'a actuellement aucun rôle disponible. Explorez d'autres projets pour trouver des opportunités qui correspondent à vos compétences."}
      </p>
      {isMaintainer ? (
        <CreateRoleForm projectId={projectId}>
          <Button className="flex items-center gap-2">
            Créer un rôle
            <Icon name="plus" size="xs" variant="white" />
          </Button>
        </CreateRoleForm>
      ) : (
        <Button className="px-4" onClick={() => (window.location.href = "/")}>
          Chercher un Projet{" "}
          <Icon
            name="search"
            size="xs"
            variant="white"
            className="scale-x-[-1]"
          />
        </Button>
      )}
    </div>
  );
}
