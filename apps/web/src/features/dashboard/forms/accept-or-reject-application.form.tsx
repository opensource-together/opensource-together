"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import StackLogo from "@/shared/components/logos/stack-logo";
import { Avatar } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Form, FormLabel } from "@/shared/components/ui/form";
import Icon from "@/shared/components/ui/icon";
import { Label } from "@/shared/components/ui/label";

import { ApplicationReceived } from "../types/my-projects.type";

const applicationDecisionSchema = z.object({
  decision: z.enum(["ACCEPTED", "REJECTED"]),
  rejectionReason: z.string().optional(),
});

type ApplicationDecisionForm = z.infer<typeof applicationDecisionSchema>;

interface AcceptOrRejectApplicationFormProps {
  application: ApplicationReceived;
  onDecision: (decision: "ACCEPTED" | "REJECTED", reason?: string) => void;
}

export default function AcceptOrRejectApplicationForm({
  application,
  onDecision,
}: AcceptOrRejectApplicationFormProps) {
  const [_selectedDecision, setSelectedDecision] = useState<
    "ACCEPTED" | "REJECTED" | null
  >(null);

  const form = useForm<ApplicationDecisionForm>({
    resolver: zodResolver(applicationDecisionSchema),
  });

  const onSubmit = (data: ApplicationDecisionForm) => {
    onDecision(data.decision, data.rejectionReason);
  };

  const handleDecisionSelect = (decision: "ACCEPTED" | "REJECTED") => {
    setSelectedDecision(decision);
    form.setValue("decision", decision);
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
    <div className="space-y-7 scroll-auto">
      <div className="mt-4 flex items-center gap-3">
        <div className="flex-shrink-0">
          <Avatar
            src={application.applicant.avatarUrl}
            name={application.applicant.name}
            alt={application.applicant.name}
            size="lg"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <Label className="truncate text-lg font-semibold">
              {application.applicant.name}
            </Label>
            <span
              className={`text-sm font-medium tracking-tighter ${getStatusStyle(application.status)}`}
            >
              {getStatusText(application.status)}
            </span>
          </div>

          <span className="text-xs text-black/50">
            Postulé le{" "}
            {new Date(application.appliedAt).toLocaleDateString("fr-FR")}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-base">
          {application.projectRole.title}{" "}
          <span className="font-normal text-black/50">
            — {application.projectTitle}
          </span>
        </Label>
        {application.projectRole.description && (
          <p className="mt-1 text-sm text-black/70">
            {application.projectRole.description}
          </p>
        )}
      </div>

      {application.projectRole.techStacks.length > 0 && (
        <div>
          <Label>Stack technique</Label>
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

      {application.motivationLetter && (
        <div>
          <Label>Lettre de motivation</Label>
          <p className="mt-2 rounded-md bg-black/5 px-4 py-3 text-sm whitespace-pre-wrap text-black/70">
            {application.motivationLetter}
          </p>
        </div>
      )}

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

      {application.status === "PENDING" && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <FormLabel required>Décision</FormLabel>
              <div className="mt-4 flex gap-3">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleDecisionSelect("REJECTED")}
                  className="flex-1"
                >
                  Refuser
                  <Icon name="cross" size="xs" variant="white" />
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
      )}
    </div>
  );
}
