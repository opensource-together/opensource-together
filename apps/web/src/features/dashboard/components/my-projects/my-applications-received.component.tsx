"use client";

import { useRouter } from "next/navigation";

import { Avatar } from "@/shared/components/ui/avatar";
import { BadgeWithIcon } from "@/shared/components/ui/badge-with-icon";
import { EmptyState } from "@/shared/components/ui/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/components/ui/table";
import { getStatusText } from "@/shared/lib/utils/status";

import { ApplicationType } from "../../types/my-projects.type";
import MyApplicationsReceivedSkeleton from "../skeletons/my-applications-received-skeleton.component";

interface MyApplicationsReceivedProps {
  applications: ApplicationType[];
  isLoading?: boolean;
  projectId: string;
  onApplicationDecision?: (
    applicationId: string,
    decision: "ACCEPTED" | "REJECTED",
    reason?: string
  ) => void;
}

export default function MyApplicationsReceived({
  applications,
  isLoading = false,
  projectId,
}: MyApplicationsReceivedProps) {
  const router = useRouter();

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
    router.push(`/dashboard/my-projects/${projectId}/${application.id}`);
  };

  return (
    <Table>
      <TableBody>
        {applications.map((application) => (
          <TableRow
            key={application.id}
            onClick={() => handleApplicationSelect(application)}
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
                <span className="text-muted-foreground mr-1">Postulé pour</span>
                <span className="font-medium">
                  {application.projectRole.title}
                </span>
              </div>
            </TableCell>

            <TableCell>
              <div className="flex items-center">
                <BadgeWithIcon
                  variant={
                    application.status === "ACCEPTED"
                      ? "success"
                      : application.status === "REJECTED"
                        ? "danger"
                        : "info"
                  }
                  key={application.applicant.id}
                  className="text-xs"
                >
                  {getStatusText(application.status)}
                </BadgeWithIcon>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <span className="text-sm font-medium tracking-tighter">
                  {new Date(application.appliedAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
