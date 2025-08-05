"use client";

import Link from "next/link";
import { useState } from "react";

import StackLogo from "@/shared/components/logos/stack-logo";
import { Button } from "@/shared/components/ui/button";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { Label } from "@/shared/components/ui/label";
import { getStatusStyle, getStatusText } from "@/shared/lib/utils/status";

import { useCancelApplication } from "../../hooks/use-project-role-application.hook";
import { ProjectRoleApplicationType } from "../../types/project-role-application.type";

export function MyApplicationDetails({
  application,
}: {
  application: ProjectRoleApplicationType;
}) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const cancelApplicationMutation = useCancelApplication();

  const handleCancelApplication = async () => {
    await cancelApplicationMutation.mutateAsync(application.applicationId);
    setIsConfirmDialogOpen(false);
  };

  return (
    <div className="sticky top-6">
      <div className="relative -top-3 flex justify-end gap-3">
        {application.status === "PENDING" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsConfirmDialogOpen(true)}
            disabled={cancelApplicationMutation.isPending}
          >
            Annuler candidature
          </Button>
        )}
        <Link href={`/projects/${application.project.id}`}>
          <Button variant="outline" size="sm">
            Voir projet
          </Button>
        </Link>
      </div>

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        title="Annuler la candidature"
        description={`Êtes-vous sûr de vouloir annuler votre candidature pour le poste "${application.projectRole.title}" du projet "${application.project.title}" ? Cette action est irréversible.`}
        isLoading={cancelApplicationMutation.isPending}
        onConfirm={handleCancelApplication}
        onCancel={() => setIsConfirmDialogOpen(false)}
        confirmText="Annuler candidature"
        confirmVariant="destructive"
        confirmIcon="trash"
      />

      <div className="top-6 space-y-8 rounded-[20px] border border-[black]/6 p-6">
        {/* Description */}
        <div className="flex justify-between">
          <div>
            <Label className="flex flex-col text-xl md:flex-row">
              {application.projectRole.title}{" "}
              <span className="font-normal text-black/50">
                — {application.project.title}
              </span>
            </Label>
            <p className="mt-4 tracking-tighter text-black/70">
              {application.projectRole.description}
            </p>
          </div>
          <div>
            <span
              className={`text-sm font-medium tracking-tighter text-nowrap ${getStatusStyle(application.status)}`}
            >
              {getStatusText(application.status)}
            </span>
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <Label>Stack technique</Label>
          <div className="mt-4 flex flex-wrap gap-2">
            {application.projectRole.techStacks.map((tech) => (
              <StackLogo
                key={tech.id}
                name={tech.name}
                icon={tech.iconUrl || ""}
                alt={tech.name}
              />
            ))}
          </div>
        </div>

        {/* Motivation */}
        {application.motivationLetter && (
          <div>
            <Label>Lettre de motivation</Label>
            <p className="mt-2 tracking-tighter whitespace-pre-wrap text-black/70">
              {application.motivationLetter}
            </p>
          </div>
        )}

        {/* Features */}
        {application.selectedKeyFeatures?.length > 0 && (
          <div>
            <Label>Fonctionnalités sélectionnées</Label>
            <ul className="my-4 list-disc space-y-1 pl-5 text-sm leading-loose font-normal text-black">
              {application.selectedKeyFeatures.map((feature) => (
                <li key={feature.feature}>{feature.feature}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Goals */}
        {application.selectedProjectGoals?.length > 0 && (
          <div>
            <Label>Objectifs sélectionnés</Label>
            <ul className="my-4 list-disc space-y-1 pl-5 text-sm leading-loose font-normal text-black">
              {application.selectedProjectGoals.map((goal) => (
                <li key={goal.goal}>{goal.goal}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-black/3" />

        {/* Date */}
        <div className="text-muted-foreground text-xs">
          Envoyée le {new Date(application.appliedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
