"use client";

import { useMyProjectRolesApplications } from "../hooks/use-project-role-application.hook";
import { ProjectRoleApplicationType } from "../types/project-role-application.type";

export default function MyApplicationsList() {
  const { data: applications, isLoading } = useMyProjectRolesApplications();

  if (isLoading) return <div>Chargement des candidatures...</div>;
  if (!applications || applications.length === 0)
    return <div>Aucune candidature reçue.</div>;

  return (
    <div className="space-y-4">
      {applications.map((application: ProjectRoleApplicationType) => (
        <div
          key={application.appplicationId}
          className="rounded-xl border border-gray-200 p-4"
        >
          <h1 className="text-lg font-medium">
            {application.projectRoleTitle}
          </h1>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500">
              {application.selectedKeyFeatures
                .map((feature) => feature)
                .join(", ")}
              ,{" "}
              {application.selectedProjectGoals.map((goal) => goal).join(", ")}
            </p>
          </div>
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500">
            {application.status}
          </span>
          <p className="text-sm text-gray-500">
            Candidature envoyée le{" "}
            {new Date(application.appliedAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
