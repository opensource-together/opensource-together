"use client";

import { useState } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";

import { useMyProjectRolesApplications } from "../hooks/use-project-role-application.hook";
import { ProjectRoleApplicationType } from "../types/project-role-application.type";

const STATUS_TABS = [
  { label: "Toutes", value: "ALL" },
  { label: "En attente", value: "PENDING" },
  { label: "Acceptée", value: "ACCEPTED" },
  { label: "Refusée", value: "REJECTED" },
];

export default function MyApplicationsList() {
  const { data: applications, isLoading } = useMyProjectRolesApplications();
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  if (isLoading) return <div>Chargement des candidatures...</div>;
  if (!applications || applications.length === 0)
    return <div>Aucune candidature reçue.</div>;

  const filteredApplications =
    selectedStatus === "ALL"
      ? applications
      : applications.filter(
          (application: ProjectRoleApplicationType) =>
            application.status === selectedStatus
        );

  return (
    <div>
      {/* Tabs de filtrage */}
      <div className="mb-6 flex gap-2">
        {STATUS_TABS.map((tab) => (
          <Button
            key={tab.value}
            onClick={() => setSelectedStatus(tab.value)}
            variant={selectedStatus === tab.value ? "default" : "outline"}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <EmptyState
            title="Aucune candidature pour ce statut."
            description="Vous n'avez pas de candidatures pour ce statut."
          />
        ) : (
          filteredApplications.map(
            (application: ProjectRoleApplicationType) => (
              <div
                key={application.appplicationId}
                className="rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={application.userProfile?.avatarUrl} />
                    <AvatarFallback>
                      {application.userProfile?.name
                        ? application.userProfile?.name.charAt(0)
                        : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-lg font-medium">
                    {application.userProfile?.name}
                  </h1>
                </div>
                <h1 className="text-lg font-medium">
                  {application.projectRoleTitle}
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">
                    {application.selectedKeyFeatures
                      .map((feature) => feature)
                      .join(", ")}
                    {application.selectedKeyFeatures.length > 0 &&
                    application.selectedProjectGoals.length > 0
                      ? ", "
                      : ""}
                    {application.selectedProjectGoals
                      .map((goal) => goal)
                      .join(", ")}
                  </p>
                </div>
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500 capitalize">
                  {application.status.toLowerCase()}
                </span>
                <p className="text-sm text-gray-500">
                  Candidature envoyée le{" "}
                  {new Date(application.appliedAt).toLocaleDateString()}
                </p>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}
