"use client";

import { PlusIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/shared/components/ui/button";

import ProjectApplicationsList from "../components/project-applications-list.component";
import { useDashboardProject } from "../context/dashboard-project.context";

export default function DashboardView() {
  const { userProjects, selectedProject } = useDashboardProject();

  if (!userProjects || userProjects.length === 0) {
    return (
      <div className="flex h-[calc(100vh-65px)] overflow-hidden md:h-[calc(100vh-85px)]">
        <main className="flex flex-1 items-center justify-center overflow-y-auto">
          <div className="flex flex-col items-center gap-4">
            <div className="text-lg text-black">
              Vous n'avez aucun projet dont vous êtes le créateur.
            </div>
            <Link href="/projects/create">
              <Button>
                Créer un projet <PlusIcon className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Projet sélectionné ou premier par défaut
  const projectToShow = selectedProject || userProjects[0];

  return (
    <div className="flex h-[calc(100vh-65px)] overflow-hidden md:h-[calc(100vh-85px)]">
      <main className="flex-1 overflow-y-auto">
        <div className="mb-4 flex items-center gap-6">
          {projectToShow.image && (
            <img
              src={projectToShow.image}
              alt={projectToShow.title}
              className="h-14 w-14 rounded-lg border border-black/10 object-cover"
            />
          )}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-medium">{projectToShow.title}</h3>
            </div>
            <div className="text-sm text-gray-600">
              {projectToShow.shortDescription}
            </div>
            <Link href={`/projects/${projectToShow.id}`}>
              <Button variant="default">
                Voir le projet
                <img
                  src="/icons/chevron-right-white.svg"
                  alt="chevron right"
                  className="mt-[1px] h-2.5 w-2.5"
                />
              </Button>
            </Link>
          </div>
        </div>
        <div className="my-10 rounded-full border-t-2 border-black/5" />
        <ProjectApplicationsList project={projectToShow} />
      </main>
    </div>
  );
}
