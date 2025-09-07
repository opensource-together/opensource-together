"use client";

import Link from "next/link";
import { HiArrowUpRight } from "react-icons/hi2";

import StackLogo from "@/shared/components/logos/stack-logo";
import { Avatar } from "@/shared/components/ui/avatar";
import { BadgeWithIcon } from "@/shared/components/ui/badge-with-icon";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { getStatusText } from "@/shared/lib/utils/status";

import { ProjectRoleApplicationType } from "../../types/project-role-application.type";

interface MyApplicationDetailsProps {
  application: ProjectRoleApplicationType;
}

export function MyApplicationDetails({
  application,
}: MyApplicationDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar
          src={application.project.image}
          name={application.project.title}
          alt={application.project.title}
          size="xl"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-medium">{application.project.title}</h1>
          <div className="mt-1">
            <BadgeWithIcon
              variant={
                application.status === "ACCEPTED"
                  ? "success"
                  : application.status === "REJECTED"
                    ? "danger"
                    : application.status === "CANCELLED"
                      ? "default"
                      : "info"
              }
              className="text-xs"
            >
              {getStatusText(application.status)}
            </BadgeWithIcon>
          </div>
        </div>
        <Link href={`/projects/${application.project.id}`}>
          <Button>
            Voir projet
            <HiArrowUpRight className="size-3" />
          </Button>
        </Link>
      </div>

      <Separator className="my-8" />

      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium">Nom du rôle</span>
          <p className="text-muted-foreground mt-2.5">
            {application.projectRoleTitle}
          </p>
        </div>
      </div>

      {application.projectRole.description && (
        <>
          <span className="text-sm font-medium">Description du rôle</span>
          <p className="text-muted-foreground mt-2.5">
            {application.projectRole.description}
          </p>
        </>
      )}

      {/* Required Technologies */}
      {application.projectRole.techStacks &&
        application.projectRole.techStacks.length > 0 && (
          <>
            <span className="text-sm font-medium">Technologies demandées</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {application.projectRole.techStacks.map((skill) => (
                <StackLogo
                  key={skill.id}
                  name={skill.name}
                  icon={skill.iconUrl || ""}
                  alt={skill.name}
                />
              ))}
            </div>
          </>
        )}

      <Separator className="my-8" />

      {application.motivationLetter && (
        <div>
          <span className="font-medium">Lettre de motivation</span>
          <p className="text-muted-foreground mt-2.5">
            {application.motivationLetter}
          </p>
        </div>
      )}

      {application.selectedKeyFeatures &&
        application.selectedKeyFeatures.length > 0 && (
          <div>
            <span className="font-medium">Fonctionnalités sélectionnées</span>
            <ul className="mt-2 space-y-1">
              {application.selectedKeyFeatures.map((feature, index) => (
                <li
                  key={index}
                  className="text-muted-foreground flex items-center gap-2 text-sm"
                >
                  <div className="bg-primary h-1.5 w-1.5 rounded-full" />
                  {feature.feature}
                </li>
              ))}
            </ul>
          </div>
        )}

      {application.selectedProjectGoals &&
        application.selectedProjectGoals.length > 0 && (
          <div>
            <span className="font-medium">Objectifs sélectionnés</span>
            <ul className="mt-2 space-y-1">
              {application.selectedProjectGoals.map((goal, index) => (
                <li
                  key={index}
                  className="text-muted-foreground flex items-center gap-2 text-sm"
                >
                  <div className="bg-primary h-1.5 w-1.5 rounded-full" />
                  {goal.goal}
                </li>
              ))}
            </ul>
          </div>
        )}

      {/* Rejection Reason */}
      {application.status === "REJECTED" && application.rejectionReason && (
        <div>
          <span className="font-medium text-red-600">Raison du refus</span>
          <div className="mt-2 rounded-md border border-red-200 bg-red-50 p-4">
            <p className="text-sm whitespace-pre-wrap text-red-700">
              {application.rejectionReason}
            </p>
          </div>
        </div>
      )}

      <Separator className="my-8" />

      <div className="text-muted-foreground text-xs">
        Candidature envoyée le{" "}
        {new Date(application.appliedAt).toLocaleDateString("fr-FR")}
        {application.decidedAt && (
          <span>
            {" "}
            • Décision prise le{" "}
            {new Date(application.decidedAt).toLocaleDateString("fr-FR")}
          </span>
        )}
      </div>
    </div>
  );
}
