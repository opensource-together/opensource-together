"use client";

import Link from "next/link";

import StackLogo from "@/shared/components/logos/stack-logo";
import { Avatar } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import Icon from "@/shared/components/ui/icon";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet";

import { ApplicationType } from "../../types/my-projects.type";

interface ApplicationDetailsSheetProps {
  application: ApplicationType;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function ApplicationDetailsSheet({
  application,
  isOpen,
  onClose,
  children,
}: ApplicationDetailsSheetProps) {
  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "En attente";
      case "ACCEPTED":
        return "Acceptée";
      case "REJECTED":
        return "Refusée";
      default:
        return status;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-orange-400";
      case "ACCEPTED":
        return "text-green-500";
      case "REJECTED":
        return "text-red-500";
      default:
        return "text-black/70";
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        responsive
        responsiveWidth={{
          mobile: "w-full",
          desktop: "w-[450px]",
        }}
        className="overflow-y-auto bg-white"
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-3">
            <Avatar
              src={application.applicant.avatarUrl}
              name={application.applicant.name}
              alt={application.applicant.name}
              size="lg"
            />
            <div className="flex-1 text-start">
              <h2 className="text-xl">{application.applicant.name}</h2>
              <p className="text-muted-foreground text-sm font-normal">
                Candidat
              </p>
            </div>

            <Link href={`/profile/${application.applicant.id}`}>
              <Button variant="outline" size="sm" className="font-medium">
                Voir profil
                <Icon name="user" size="xs" />
              </Button>
            </Link>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Statut</span>
              <div className="mx-4 flex flex-1 items-center">
                <Separator />
              </div>
              <span
                className={`text-sm font-medium ${getStatusStyle(application.status)}`}
              >
                {getStatusText(application.status)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Postulé le</span>
              <div className="mx-4 flex flex-1 items-center">
                <Separator />
              </div>
              <span className="text-sm font-medium">
                {new Date(application.appliedAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                Postulé pour le rôle
              </span>
              <div className="mx-4 flex flex-1 items-center">
                <Separator />
              </div>
              <span className="text-sm font-medium">
                {application.projectRole.title}
              </span>
            </div>
          </div>

          {application.projectRole.description && (
            <div>
              <Label className="text-sm font-medium">Description du rôle</Label>
              <p className="mt-2 text-sm whitespace-pre-wrap">
                {application.projectRole.description}
              </p>
            </div>
          )}

          {application.projectRole.techStacks &&
            application.projectRole.techStacks.length > 0 && (
              <div>
                <Label className="text-sm font-medium">
                  Technologies demandées
                </Label>
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
              </div>
            )}

          <Separator />

          {application.motivationLetter && (
            <div>
              <Label className="text-sm font-medium">
                Lettre de motivation
              </Label>
              <div className="bg-muted/50 mt-2 rounded-md p-4">
                <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                  {application.motivationLetter}
                </p>
              </div>
            </div>
          )}

          {application.applicant.techStacks &&
            application.applicant.techStacks.length > 0 && (
              <div>
                <Label className="text-sm font-medium">
                  Compétences du candidat
                </Label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {application.applicant.techStacks.map((skill) => (
                    <StackLogo
                      key={skill.id}
                      name={skill.name}
                      icon={skill.iconUrl || ""}
                      alt={skill.name}
                    />
                  ))}
                </div>
              </div>
            )}

          {application.selectedKeyFeatures &&
            application.selectedKeyFeatures.length > 0 && (
              <div>
                <Label className="text-sm font-medium">
                  Fonctionnalités sélectionnées
                </Label>
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
                <Label className="text-sm font-medium">
                  Objectifs sélectionnés
                </Label>
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

          {application.status === "REJECTED" && application.rejectionReason && (
            <div>
              <Label className="text-sm font-medium text-red-600">
                Raison du refus
              </Label>
              <div className="mt-2 rounded-md border border-red-200 bg-red-50 p-4">
                <p className="text-sm whitespace-pre-wrap text-red-700">
                  {application.rejectionReason}
                </p>
              </div>
            </div>
          )}

          {application.status === "PENDING" && children && (
            <div className="bg-background sticky bottom-0 mt-6 border-t pt-4">
              {children}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
