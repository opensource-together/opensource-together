"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { HiCheck } from "react-icons/hi";

import { Button } from "@/shared/components/ui/button";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";

import UserApplicationDetails from "../../components/my-projects/user-application-details.component";
import { useMyProjectDetails } from "../../hooks/use-my-projects.hook";
import {
  useAcceptProjectRoleApplication,
  useRejectProjectRoleApplication,
} from "../../hooks/use-project-role-application.hook";

export default function UserApplicationView() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const applicationId = params.applicationId as string;

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: "ACCEPTED" | "REJECTED" | null;
  }>({
    open: false,
    action: null,
  });

  const { data: project, isLoading } = useMyProjectDetails(projectId);
  const { acceptApplication, isAccepting } = useAcceptProjectRoleApplication();
  const { rejectApplication, isRejecting } = useRejectProjectRoleApplication();

  if (isLoading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;

  const application = project.applications.find(
    (app) => app.id === applicationId
  );

  if (!application) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <div>Candidature non trouvée</div>
      </div>
    );
  }

  const handleDecision = (decision: "ACCEPTED" | "REJECTED") => {
    setConfirmDialog({
      open: true,
      action: decision,
    });
  };

  const handleConfirm = () => {
    if (!confirmDialog.action) return;

    if (confirmDialog.action === "ACCEPTED") {
      acceptApplication(application.id, {
        onSuccess: () => {
          router.push(`/dashboard/my-projects/${projectId}`);
        },
      });
    } else {
      rejectApplication(application.id, {
        onSuccess: () => {
          router.push(`/dashboard/my-projects/${projectId}`);
        },
      });
    }

    setConfirmDialog({ open: false, action: null });
  };

  const handleCancel = () => {
    setConfirmDialog({ open: false, action: null });
  };

  return (
    <div>
      <UserApplicationDetails application={application} />
      {application.status === "PENDING" && (
        <div className="border-t-muted-black-stroke sticky bottom-0 mt-24 flex justify-end gap-3 border-t bg-white p-4">
          <Button
            onClick={() => handleDecision("REJECTED")}
            variant="secondary"
          >
            Refuser
          </Button>
          <Button onClick={() => handleDecision("ACCEPTED")} variant="default">
            Accepter
            <HiCheck className="size-3" />
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
        title={
          confirmDialog.action === "ACCEPTED"
            ? "Accepter la candidature"
            : "Refuser la candidature"
        }
        description={`Êtes-vous sûr de vouloir ${
          confirmDialog.action === "ACCEPTED" ? "accepter" : "refuser"
        } la candidature de ${application.applicant.name} ?`}
        isLoading={isAccepting || isRejecting}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmText={
          confirmDialog.action === "ACCEPTED" ? "Accepter" : "Refuser"
        }
        confirmVariant={
          confirmDialog.action === "ACCEPTED" ? "default" : "destructive"
        }
      />
    </div>
  );
}
