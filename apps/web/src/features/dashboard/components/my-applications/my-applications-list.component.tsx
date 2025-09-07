"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiXMark } from "react-icons/hi2";

import { Avatar } from "@/shared/components/ui/avatar";
import { BadgeWithIcon } from "@/shared/components/ui/badge-with-icon";
import { Button } from "@/shared/components/ui/button";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/components/ui/table";

import {
  useCancelApplication,
  useMyProjectRolesApplications,
} from "../../hooks/use-project-role-application.hook";
import { ProjectRoleApplicationType } from "../../types/project-role-application.type";

function ApplicationSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[100px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[80px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[100px]" />
      </TableCell>
    </TableRow>
  );
}

export function MyApplicationsList() {
  const { data: applications, isLoading } = useMyProjectRolesApplications();
  const { cancelApplication, isCanceling } = useCancelApplication();
  const router = useRouter();
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    application: ProjectRoleApplicationType | null;
  }>({
    open: false,
    application: null,
  });

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "En attente";
      case "ACCEPTED":
        return "Acceptée";
      case "REJECTED":
        return "Refusée";
      case "CANCELLED":
        return "Annulée";
      default:
        return status;
    }
  };

  const handleCancelApplication = (application: ProjectRoleApplicationType) => {
    setConfirmDialog({
      open: true,
      application,
    });
  };

  const handleConfirmCancel = () => {
    if (confirmDialog.application) {
      cancelApplication(confirmDialog.application.applicationId);
      setConfirmDialog({
        open: false,
        application: null,
      });
    }
  };

  const handleCancelDialog = () => {
    setConfirmDialog({
      open: false,
      application: null,
    });
  };

  const handleApplicationClick = (application: ProjectRoleApplicationType) => {
    router.push(`/dashboard/my-applications/${application.applicationId}`);
  };

  if (isLoading) {
    return (
      <div>
        <Table>
          <TableBody>
            <ApplicationSkeleton />
            <ApplicationSkeleton />
            <ApplicationSkeleton />
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <EmptyState
        title="Aucune candidature"
        description="Vous n'avez pas encore postulé à des projets."
      />
    );
  }

  return (
    <div className="space-y-6">
      {applications.length === 0 ? (
        <EmptyState
          title="Aucune candidature pour ce statut"
          description="Vous n'avez pas de candidatures correspondant à ce filtre."
        />
      ) : (
        <div>
          <Table>
            <TableBody>
              {applications.map((application: ProjectRoleApplicationType) => (
                <TableRow
                  key={application.applicationId}
                  onClick={() => handleApplicationClick(application)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={application.project.image}
                        name={application.project.title}
                        alt={application.project.title}
                        size="md"
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">
                            {application.project.title}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm text-nowrap">
                      <span className="text-muted-foreground mr-1">
                        Postulé à
                      </span>
                      <span className="font-medium">
                        {application.projectRoleTitle}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
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
                  </TableCell>

                  <TableCell>
                    <span className="text-sm font-medium">
                      {new Date(application.appliedAt).toLocaleDateString(
                        "fr-FR"
                      )}
                    </span>
                  </TableCell>

                  <TableCell>
                    {application.status === "PENDING" && (
                      <Button
                        variant="ghost"
                        size="ghostIcon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelApplication(application);
                        }}
                        disabled={isCanceling}
                      >
                        <HiXMark size={16} />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
        title="Annuler la candidature"
        description={
          confirmDialog.application
            ? `Êtes-vous sûr de vouloir annuler votre candidature pour le poste "${confirmDialog.application.projectRoleTitle}" du projet "${confirmDialog.application.project.title}" ? Cette action est irréversible.`
            : ""
        }
        isLoading={isCanceling}
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelDialog}
        confirmText="Annuler candidature"
        confirmVariant="destructive"
        confirmIcon="trash"
      />
    </div>
  );
}
