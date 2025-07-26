"use client";

import { EmptyState } from "@/shared/components/ui/empty-state";

import DashboardHeading from "../components/layout/dashboard-heading.component";
import MyProjectsList from "../components/my-projects-list.component";

export default function MyProjectsView() {
  return (
    <div>
      <DashboardHeading
        title="Mes projets"
        description="Vous pouvez visualiser vos projets Open Source ici et consulter les candidatures."
      />
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Section Mes Projets */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Mes projets</h2>
          <MyProjectsList />
        </div>

        {/* Section Candidatures */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Candidatures reçues</h2>
          <EmptyState
            title="Aucune candidature reçue"
            description="Vous n'avez pas de candidatures reçues pour le moment."
          />
        </div>
      </div>
    </div>
  );
}
