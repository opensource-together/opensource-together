"use client";

import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";

import useAuth from "@/features/auth/hooks/use-auth.hook";
import {
  useAcceptProjectRoleApplication,
  useProjectApplications,
  useRejectProjectRoleApplication,
} from "@/features/projects/hooks/use-project-applications.hook";
import { useProjects } from "@/features/projects/hooks/use-projects.hook";

import ApplicationCard from "../components/application-card.component";
import DashboardSidebar from "../components/dashboard-sidebar.component";

function ProjectApplicationsList({ project }: { project: any }) {
  const { data: applications, isLoading } = useProjectApplications(project.id);
  const acceptMutation = useAcceptProjectRoleApplication(project.id);
  const rejectMutation = useRejectProjectRoleApplication(project.id);

  if (isLoading) return <div>Chargement des candidatures...</div>;
  if (!applications || applications.length === 0)
    return <div>Aucune candidature reçue.</div>;

  return (
    <div className="space-y-4">
      {applications.map((application: any) => (
        <ApplicationCard
          key={application.id}
          application={application}
          keyFeatures={project.keyFeatures}
          projectGoals={project.projectGoals}
          onAccept={() => acceptMutation.mutate(application.id)}
          onReject={() => rejectMutation.mutate(application.id)}
          isProcessing={acceptMutation.isPending || rejectMutation.isPending}
        />
      ))}
    </div>
  );
}

export default function DashboardView() {
  const { data: projects, isLoading: isProjectsLoading } = useProjects();
  const { currentUser, isLoading: isUserLoading } = useAuth();
  const [selectedProject, setSelectedProject] = useState<any>(null);

  if (isProjectsLoading || isUserLoading) {
    return <div>Chargement...</div>;
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex h-[calc(100vh-65px)] overflow-hidden md:h-[calc(100vh-85px)]">
        <DashboardSidebar projects={[]} />
        <main className="flex flex-1 items-center justify-center overflow-y-auto px-14 pt-12">
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

  // Filtrer les projets dont l'utilisateur courant est owner
  const userProjects = projects.filter((project) => {
    const ownerId = project.ownerId || project.author?.ownerId;
    return currentUser && ownerId && currentUser.id === ownerId;
  });

  if (userProjects.length === 0) {
    return (
      <div className="flex h-[calc(100vh-65px)] overflow-hidden md:h-[calc(100vh-85px)]">
        <DashboardSidebar projects={[]} />
        <main className="flex flex-1 items-center justify-center overflow-y-auto px-14 pt-12">
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
      <DashboardSidebar
        projects={userProjects}
        onProjectSelect={setSelectedProject}
      />
      <main className="flex-1 overflow-y-auto px-14 pt-12">
        <h2 className="mb-6 text-2xl font-bold">Candidatures reçues</h2>
        <h3 className="mb-4 text-xl font-semibold">{projectToShow.title}</h3>
        <ProjectApplicationsList project={projectToShow} />
      </main>
    </div>
  );
}
