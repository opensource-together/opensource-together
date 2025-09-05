"use client";

import { useState } from "react";
import { HiArrowRight } from "react-icons/hi";

import { Avatar } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
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
      <div className="overflow-hidden rounded-lg border border-black/10">
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
                      {application.applicant.techStacks &&
                        application.applicant.techStacks.length > 0 && (
                          <div className="mt-1 flex items-center">
                            <div className="flex gap-1">
                              {application.applicant.techStacks
                                .slice(0, 3)
                                .map((tech) => {
                                  return (
                                    <Badge
                                      variant="outline"
                                      key={tech.id}
                                      className="text-xs"
                                    >
                                      {tech.name}
                                    </Badge>
                                  );
                                })}
                            </div>
                            {application.applicant.techStacks.length > 3 && (
                              <span className="ml-1 flex h-5.5 flex-shrink-0 items-center rounded-full bg-transparent text-xs whitespace-nowrap text-black/20">
                                +{application.applicant.techStacks.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs text-black/50">Postulé pour</span>
                    <span className="text-sm font-medium tracking-tighter">
                      {application.projectRole.title}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs text-black/50">Postulé le</span>
                    <span className="text-sm font-medium tracking-tighter">
                      {new Date(application.appliedAt).toLocaleDateString(
                        "fr-FR"
                      )}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs text-black/50">Statut</span>
                    <span
                      className={`text-sm font-medium tracking-tighter ${getStatusStyle(application.status)}`}
                    >
                      {getStatusText(application.status)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end">
                    <HiArrowRight className="text-muted-foreground h-4 w-4" />
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
