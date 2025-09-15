"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { Form, FormLabel } from "@/shared/components/ui/form";
import Icon from "@/shared/components/ui/icon";

import { ApplicationType } from "../types/my-projects.type";
import {
  ApplicationDecisionForm,
  applicationDecisionSchema,
} from "../validations/accept-or-reject.schema";

interface AcceptOrRejectApplicationFormProps {
  application: ApplicationType;
  onAccept: (applicationId: string) => void;
  onReject: (applicationId: string, reason: string) => void;
}

export default function AcceptOrRejectApplicationForm({
  application,
  onAccept,
  onReject,
}: AcceptOrRejectApplicationFormProps) {
  const [_selectedDecision, setSelectedDecision] = useState<
    "ACCEPTED" | "REJECTED" | null
  >(null);
  const [rejectionReason, _setRejectionReason] = useState("");
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "ACCEPTED" | "REJECTED" | null;
  }>({
    open: false,
    type: null,
  });

  const form = useForm<ApplicationDecisionForm>({
    resolver: zodResolver(applicationDecisionSchema),
  });

  const handleDecisionSelect = (decision: "ACCEPTED" | "REJECTED") => {
    setSelectedDecision(decision);
    form.setValue("decision", decision);

    setConfirmDialog({
      open: true,
      type: decision,
    });
  };

  const handleConfirmDecision = () => {
    if (confirmDialog.type === "ACCEPTED") {
      onAccept(application.id);
    } else if (confirmDialog.type === "REJECTED") {
      onReject(application.id, rejectionReason);
    }

    setConfirmDialog({
      open: false,
      type: null,
    });
  };

  const handleCancelDecision = () => {
    setConfirmDialog({
      open: false,
      type: null,
    });
  };

  const getConfirmDialogConfig = () => {
    if (confirmDialog.type === "ACCEPTED") {
      return {
        title: "Accepter la candidature",
        description: `Êtes-vous sûr de vouloir accepter la candidature de ${application.applicant.name} ?`,
        confirmText: "Accepter",
        confirmIcon: "check" as const,
        confirmVariant: "default" as const,
      };
    } else if (confirmDialog.type === "REJECTED") {
      return {
        title: "Refuser la candidature",
        description: `Êtes-vous sûr de vouloir refuser la candidature de ${application.applicant.name} ?`,
        confirmText: "Refuser",
        confirmIcon: "cross" as const,
        confirmVariant: "destructive" as const,
      };
    }
    return {
      title: "",
      description: "",
      confirmText: "",
      confirmIcon: "check" as const,
      confirmVariant: "default" as const,
    };
  };

  const dialogConfig = getConfirmDialogConfig();

  const renderApplicationActions = () => {
    if (application.status !== "PENDING") return null;

    return (
      <Form {...form}>
        <form className="space-y-4">
          <div>
            <FormLabel className="text-sm font-medium">Décision</FormLabel>
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
    );
  };

  return (
    <>
      {renderApplicationActions()}

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
        title={dialogConfig.title}
        description={dialogConfig.description}
        isLoading={false}
        onConfirm={handleConfirmDecision}
        onCancel={handleCancelDecision}
        confirmText={dialogConfig.confirmText}
        confirmIcon={dialogConfig.confirmIcon}
        confirmVariant={dialogConfig.confirmVariant}
      />
    </>
  );
}
