"use client";

import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import Icon from "@/shared/components/ui/icon";

export default function MyProjectsList() {
  return (
    <div>
      <EmptyState
        title="Aucun projet"
        description="Vous n'avez pas de projets. Créez un projet pour commencer."
        className="mt-10"
        action={
          <Link href="/projects/create">
            <Button>
              Créer un projet
              <Icon name="arrow-up-right" variant="white" size="xs" />
            </Button>
          </Link>
        }
      />
    </div>
  );
}
