"use client";

import { useState } from "react";

import { Avatar } from "@/shared/components/ui/avatar";
import { BadgeWithIcon } from "@/shared/components/ui/badge-with-icon";
import { EmptyState } from "@/shared/components/ui/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/components/ui/table";
import { getStatusStyle, getStatusText } from "@/shared/lib/utils/status";

import ApplicationDetailsSheet from "../../forms/accept-or-reject-application.form";
import { ApplicationType } from "../../types/my-projects.type";
import MyApplicationsReceivedSkeleton from "../skeletons/my-applications-received-skeleton.component";

interface MyApplicationsReceivedProps {
  applications: ApplicationType[];
  isLoading?: boolean;
  onApplicationDecision?: (
    applicationId: string,
    decision: "ACCEPTED" | "REJECTED",
    reason?: string
  ) => void;
}

export default function MyApplicationsReceived({
  applications,
  isLoading = false,
  onApplicationDecision,
}: MyApplicationsReceivedProps) {
  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationType | null>(null);

  if (isLoading) {
    return <MyApplicationsReceivedSkeleton />;
  }

  if (applications.length === 0) {
    return (
      <EmptyState
        title="Aucune candidature reçue"
        description="Vous n'avez pas de candidatures reçues pour le moment."
      />
    );
  }

  const handleApplicationSelect = (application: ApplicationType) => {
    setSelectedApplication(application);
  };

  const handleCloseSheet = () => {
    setSelectedApplication(null);
  };

  const handleDecision = (
    decision: "ACCEPTED" | "REJECTED",
    reason?: string
  ) => {
    if (selectedApplication) {
      onApplicationDecision?.(selectedApplication.id, decision, reason);
      handleCloseSheet();
    }
  };

  return (
    <>
      <div>
        <Table>
          <TableBody>
            {applications.map((application) => (
              <TableRow
                key={application.id}
                onClick={() => handleApplicationSelect(application)}
                className="hover:bg-muted/50 active:bg-muted/70 cursor-pointer transition-colors duration-200"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={application.applicant.avatarUrl}
                      name={application.applicant.name}
                      alt={application.applicant.name}
                      size="md"
                    />
                    <div className="flex flex-col">
                      <h4>{application.applicant.name}</h4>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <span className="text-muted-foreground mr-1">
                      Postulé pour
                    </span>
                    <span className="font-medium">
                      {application.projectRole.title}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center">
                    <span
                      className={`text-sm font-medium tracking-tighter ${getStatusStyle(application.status)}`}
                    >
                      <BadgeWithIcon
                        variant="info"
                        key={application.applicant.id}
                        className="text-xs"
                      >
                        {getStatusText(application.status)}
                      </BadgeWithIcon>
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="text-sm font-medium tracking-tighter">
                      {new Date(application.appliedAt).toLocaleDateString(
                        "fr-FR"
                      )}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedApplication && (
        <ApplicationDetailsSheet
          application={selectedApplication}
          isOpen={!!selectedApplication}
          onClose={handleCloseSheet}
          onAccept={() => handleDecision("ACCEPTED")}
          onReject={(_, reason) => handleDecision("REJECTED", reason)}
        />
      )}
    </>
  );
}
