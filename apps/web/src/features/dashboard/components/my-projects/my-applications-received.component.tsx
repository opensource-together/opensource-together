"use client";

import { useState } from "react";

import { Avatar } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Modal } from "@/shared/components/ui/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/components/ui/table";
import { getStatusStyle, getStatusText } from "@/shared/lib/utils/status";

import AcceptOrRejectApplicationForm from "../../forms/accept-or-reject-application.form";
import { ApplicationReceived } from "../../types/my-projects.type";

interface MyApplicationsReceivedProps {
  applications: ApplicationReceived[];
  onApplicationDecision?: (
    applicationId: string,
    decision: "ACCEPTED" | "REJECTED",
    reason?: string
  ) => void;
}

export default function MyApplicationsReceived({
  applications,
  onApplicationDecision,
}: MyApplicationsReceivedProps) {
  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationReceived | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (applications.length === 0) {
    return (
      <EmptyState
        title="Aucune candidature reçue"
        description="Vous n'avez pas de candidatures reçues pour le moment."
      />
    );
  }

  const handleOpenModal = (application: ApplicationReceived) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedApplication(null);
    setIsModalOpen(false);
  };

  const handleDecision = (
    decision: "ACCEPTED" | "REJECTED",
    reason?: string
  ) => {
    if (selectedApplication) {
      onApplicationDecision?.(selectedApplication.id, decision, reason);
      handleCloseModal();
    }
  };

  return (
    <>
      <div className="rounded-lg border border-black/10">
        <Table>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={application.applicant.avatarUrl}
                      name={application.applicant.name}
                      alt={application.applicant.name}
                      size="md"
                    />
                    <div className="flex flex-col">
                      <h4 className="font-medium tracking-tighter">
                        {application.applicant.name}
                      </h4>
                      {application.projectRole.techStacks &&
                        application.projectRole.techStacks.length > 0 && (
                          <div className="mt-1 flex items-center">
                            <div className="flex gap-1">
                              {application.projectRole.techStacks
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
                            {application.projectRole.techStacks.length > 3 && (
                              <span className="ml-1 flex h-5.5 flex-shrink-0 items-center rounded-full bg-transparent text-xs whitespace-nowrap text-black/20">
                                +{application.projectRole.techStacks.length - 3}
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenModal(application)}
                    disabled={application.status !== "PENDING"}
                    className="flex-shrink-0"
                  >
                    Inspecter
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={`Candidature de ${selectedApplication?.applicant.name}`}
        size="xl"
      >
        {selectedApplication && (
          <AcceptOrRejectApplicationForm
            application={selectedApplication}
            onDecision={handleDecision}
          />
        )}
      </Modal>
    </>
  );
}
