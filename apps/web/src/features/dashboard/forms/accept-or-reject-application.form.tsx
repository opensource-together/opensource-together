"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import StackLogo from "@/shared/components/logos/stack-logo";
import { Avatar } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Form, FormLabel } from "@/shared/components/ui/form";
import Icon from "@/shared/components/ui/icon";
import { Label } from "@/shared/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet";

import { ApplicationType } from "../types/my-projects.type";
import {
  ApplicationDecisionForm,
  applicationDecisionSchema,
} from "../validations/accept-or-reject.schema";

interface AcceptOrRejectApplicationFormProps {
  application: ApplicationType;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (applicationId: string) => void;
  onReject: (applicationId: string, reason: string) => void;
}

export default function AcceptOrRejectApplicationForm({
  application,
  isOpen,
  onClose,
  onAccept,
  onReject,
}: AcceptOrRejectApplicationFormProps) {
  const [selectedDecision, setSelectedDecision] = useState<
    "ACCEPTED" | "REJECTED" | null
  >(null);
  const [rejectionReason, _setRejectionReason] = useState("");

  const form = useForm<ApplicationDecisionForm>({
    resolver: zodResolver(applicationDecisionSchema),
  });

  const handleDecisionSelect = (decision: "ACCEPTED" | "REJECTED") => {
    setSelectedDecision(decision);
    form.setValue("decision", decision);
  };

  const handleSubmit = () => {
    if (selectedDecision === "ACCEPTED") {
      onAccept(application.id);
    } else if (selectedDecision === "REJECTED") {
      onReject(application.id, rejectionReason);
    }
  };

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
        side="right"
        className="w-full overflow-y-auto sm:w-[600px] lg:w-[700px]"
      >
        <SheetHeader className="bg-background sticky top-0 z-10 border-b pb-4">
          <SheetTitle className="flex items-center gap-3">
            <Avatar
              src={application.applicant.avatarUrl}
              name={application.applicant.name}
              alt={application.applicant.name}
              size="lg"
            />
            <div>
              <h2 className="text-xl font-medium">
                {application.applicant.name}
              </h2>
              <p className="text-muted-foreground text-sm font-normal">
                {application.projectRole.title}
              </p>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Informations de base */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Statut</span>
              <span
                className={`text-sm font-medium ${getStatusStyle(application.status)}`}
              >
                {getStatusText(application.status)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Postulé le</span>
              <span className="text-sm font-medium">
                {new Date(application.appliedAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>

          {application.projectRole.techStacks.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Stack technique</Label>
              <div className="mt-3 flex flex-wrap gap-2">
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
          )}

          {/* Lettre de motivation */}
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

          {/* Fonctionnalités sélectionnées */}
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

          {/* Objectifs sélectionnés */}
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

          {/* Actions pour les candidatures en attente */}
          {application.status === "PENDING" && (
            <div className="bg-background sticky bottom-0 mt-6 border-t pt-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4"
                >
                  <div>
                    <FormLabel className="text-sm font-medium">
                      Décision
                    </FormLabel>
                    <div className="mt-3 flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleDecisionSelect("REJECTED")}
                        className="flex-1"
                      >
                        Refuser
                        <Icon name="cross" size="xs" />
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleDecisionSelect("ACCEPTED")}
                        className="flex-1"
                      >
                        Accepter
                        <Icon name="check" size="xs" variant="white" />
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
