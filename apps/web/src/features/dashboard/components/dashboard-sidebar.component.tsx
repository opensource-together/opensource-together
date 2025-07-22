"use client";

import { FolderIcon, GitBranchIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import Icon from "@/shared/components/ui/icon";

import { useProjects } from "@/features/projects/hooks/use-projects.hook";
import { ProjectRoleApplicationType } from "@/features/projects/types/project-application.type";
import { Project } from "@/features/projects/types/project.type";

interface DashboardSidebarProps {
  projects?: Project[];
  applications?: ProjectRoleApplicationType[];
  contributions?: any[];
}

export default function DashboardSidebar({
  projects = [],
  applications = [],
  contributions = [],
  onProjectSelect,
}: DashboardSidebarProps & { onProjectSelect?: (project: Project) => void }) {
  // Utiliser les vrais projets de l'utilisateur
  const { data: userProjects = [], isLoading } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  const handleProjectClick = (project: Project) => {
    setSelectedProjectId(project.id || null);
    onProjectSelect?.(project);
  };

  return (
    <aside className="mt-5 ml-7 flex h-[95%] w-72 flex-col rounded-2xl border border-[black]/5 bg-white">
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
        {/* Dashboard Section */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <FolderIcon className="h-4 w-4" />
            Dashboard
          </h3>
          <div className="space-y-1">
            {isLoading ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                Chargement...
              </div>
            ) : projects.length > 0 ? (
              projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-gray-50 ${selectedProjectId === project.id ? "bg-gray-100" : ""}`}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={project.image} alt={project.title} />
                    <AvatarFallback className="text-xs">
                      {project.title?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{project.title}</span>
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                Aucun projet dont vous êtes le créateur
              </div>
            )}
          </div>
        </div>

        {/* My Role Applications Section */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <UserIcon className="h-4 w-4" />
            My Role Applications
          </h3>
          <div className="space-y-1">
            {applications.length > 0 ? (
              applications.map((application: ProjectRoleApplicationType) => (
                <Link
                  key={application.id}
                  href={`/applications/${application.id}`}
                  className="flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-gray-50"
                >
                  <span className="text-sm">
                    {application.projectRoleTitle}
                  </span>
                  <Badge
                    variant={
                      application.status === "ACCEPTED"
                        ? "success"
                        : application.status === "REJECTED"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {application.status}
                  </Badge>
                </Link>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                No applications yet
              </div>
            )}
          </div>
        </div>

        {/* My Contributions Section */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <GitBranchIcon className="h-4 w-4" />
            My Contributions
          </h3>
          <div className="space-y-1">
            {contributions.length > 0 ? (
              contributions.map((contribution: any) => (
                <Link
                  key={contribution.id}
                  href={`/contributions/${contribution.id}`}
                  className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-gray-50"
                >
                  <span className="text-sm">{contribution.title}</span>
                </Link>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                No contributions yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mx-4 my-5">
        <Button asChild className="w-full">
          <Link href="/projects/create">
            Créer un Project
            <Icon name="plus" size="xs" variant="white" />
          </Link>
        </Button>
      </div>
    </aside>
  );
}
