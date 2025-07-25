"use client";

import { useState } from "react";

import { Badge } from "@/shared/components/ui/badge";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import Icon from "@/shared/components/ui/icon";
import { Modal } from "@/shared/components/ui/modal";

import { ProjectRoleApplicationType } from "../../projects/types/project-application.type";
import { KeyFeature, ProjectGoal } from "../../projects/types/project.type";

interface ApplicationCardProps {
  application?: ProjectRoleApplicationType;
  keyFeatures?: KeyFeature[];
  projectGoals?: ProjectGoal[];
  className?: string;
  onAccept?: (applicationId: string) => void;
  onReject?: (applicationId: string) => void;
  isProcessing?: boolean;
}

export default function ApplicationCard({
  application,
  keyFeatures = [],
  projectGoals = [],
  className,
  onAccept,
  onReject,
  isProcessing = false,
}: ApplicationCardProps) {
  const [isRejectConfirmOpen, setIsRejectConfirmOpen] = useState(false);
  const [isAcceptConfirmOpen, setIsAcceptConfirmOpen] = useState(false);
  const [isMotivationModalOpen, setIsMotivationModalOpen] = useState(false);

  const {
    id,
    userProfile,
    projectRoleTitle,
    selectedKeyFeatures = [],
    selectedProjectGoals = [],
    motivationLetter,
    status,
    appliedAt,
  } = application || {};

  const userName = userProfile?.name;
  const userAvatarUrl = userProfile?.avatarUrl;

  // Get selected features and goals by matching the strings directly
  const selectedKeyFeaturesList = keyFeatures.filter((feature) =>
    selectedKeyFeatures.includes(feature.feature)
  );

  const selectedProjectGoalsList = projectGoals.filter((goal) =>
    selectedProjectGoals.includes(goal.goal)
  );

  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();

      // Vérifier si la date est valide
      if (isNaN(date.getTime())) {
        return "Date invalide";
      }

      const diffInMs = now.getTime() - date.getTime();
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

      if (diffInHours < 1) return "il y a moins d'une heure";
      if (diffInHours < 24)
        return `il y a ${diffInHours} heure${diffInHours > 1 ? "s" : ""}`;

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7)
        return `il y a ${diffInDays} jour${diffInDays > 1 ? "s" : ""}`;

      const diffInWeeks = Math.floor(diffInDays / 7);
      return `il y a ${diffInWeeks} semaine${diffInWeeks > 1 ? "s" : ""}`;
    } catch (error) {
      return "Date invalide@" + error;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "ACCEPTED":
        return (
          <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">
            Acceptée
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">
            Refusée
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">
            En attente
          </Badge>
        );
    }
  };

  const handleAccept = () => {
    onAccept?.(id || "");
    setIsAcceptConfirmOpen(false);
  };

  const handleReject = () => {
    onReject?.(id || "");
    setIsRejectConfirmOpen(false);
  };

  return (
    <>
      <div
        className={`w-full max-w-[668px] rounded-[20px] border border-[black]/5 p-4 shadow-xs md:p-6 ${className}`}
      >
        {/* Header - exactement comme RoleCard */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {userAvatarUrl ? (
              <img
                src={userAvatarUrl}
                alt={userName || "Utilisateur"}
                className="h-12 w-12 rounded-full bg-gray-200 object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-800">
                {userName ? userName.slice(0, 2).toUpperCase() : "?"}
              </div>
            )}
            <div>
              <h3 className="text-xl font-medium tracking-tighter text-black">
                {userName || "Utilisateur inconnu"}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {getStatusBadge()}
            {status === "PENDING" && (
              <>
                <button
                  onClick={() => setIsAcceptConfirmOpen(true)}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full p-2 transition-colors hover:bg-green-50"
                  disabled={isProcessing}
                >
                  <Icon
                    name="check"
                    variant="default"
                    size="sm"
                    className="text-green-600"
                  />
                </button>
                <button
                  onClick={() => setIsRejectConfirmOpen(true)}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full p-2 transition-colors hover:bg-red-50"
                  disabled={isProcessing}
                >
                  <Icon
                    name="cross"
                    variant="default"
                    size="sm"
                    className="text-red-600"
                  />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Description - exactement comme RoleCard */}
        <div className="mb-4 md:mb-6">
          <p className="text-sm leading-relaxed tracking-tighter text-black/70">
            Candidature pour le rôle • {projectRoleTitle || "Rôle inconnu"} •{" "}
            {formatRelativeTime(appliedAt || "")}
          </p>
          <span
            onClick={() => setIsMotivationModalOpen(true)}
            className="mt-2 inline-flex cursor-pointer items-center gap-1 opacity-35 transition-opacity hover:opacity-40"
          >
            <span className="text-sm text-black">
              Voir la lettre de motivation
            </span>
            <Icon name="arrow-up-right" size="xs" />
          </span>
        </div>

        {/* Ligne de séparation - exactement comme RoleCard */}
        <div className="mb-3 w-full border-t border-black/5"></div>

        {/* Bottom Section - exactement comme RoleCard */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-0">
          {/* Badges - comme les tech badges dans RoleCard */}
          <div className="flex flex-wrap gap-2">
            {selectedKeyFeaturesList.map((feature, index) => (
              <Badge
                key={`feature-${index}`}
                className="bg-gray-100 text-gray-600 hover:bg-gray-100"
              >
                {feature.feature}
              </Badge>
            ))}
            {selectedProjectGoalsList.map((goal, index) => (
              <Badge
                key={`goal-${index}`}
                className="bg-gray-100 text-gray-600 hover:bg-gray-100"
              >
                {goal.goal}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Motivation Letter Modal */}
      <Modal
        open={isMotivationModalOpen}
        onOpenChange={setIsMotivationModalOpen}
        title={`Lettre de motivation de ${userName || "l'utilisateur"}`}
        size="xl"
      >
        <div className="mt-4">
          {motivationLetter ? (
            <p className="rounded-xl border border-black/5 bg-black/5 p-4 text-sm leading-relaxed text-black">
              {motivationLetter}
            </p>
          ) : (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                Il n'y a pas de lettre de motivation pour cette candidature.
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* Accept confirmation dialog */}
      <ConfirmDialog
        open={isAcceptConfirmOpen}
        onOpenChange={setIsAcceptConfirmOpen}
        title="Accepter la candidature"
        description={`Êtes-vous sûr de vouloir accepter la candidature de ${userName || "cet utilisateur"} pour le rôle ${projectRoleTitle} ?`}
        isLoading={isProcessing}
        onConfirm={handleAccept}
        onCancel={() => setIsAcceptConfirmOpen(false)}
      />

      {/* Reject confirmation dialog */}
      <ConfirmDialog
        open={isRejectConfirmOpen}
        onOpenChange={setIsRejectConfirmOpen}
        title="Refuser la candidature"
        description={`Êtes-vous sûr de vouloir refuser la candidature de ${userName || "cet utilisateur"} pour le rôle ${projectRoleTitle} ?`}
        isLoading={isProcessing}
        onConfirm={handleReject}
        onCancel={() => setIsRejectConfirmOpen(false)}
      />
    </>
  );
}
