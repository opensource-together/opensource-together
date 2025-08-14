"use client";

import { useState } from "react";

import StackLogo from "@/shared/components/logos/stack-logo";
import { Button } from "@/shared/components/ui/button";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import Icon from "@/shared/components/ui/icon";

import useAuth from "@/features/auth/hooks/use-auth.hook";

import EditRoleForm from "../forms/edit-role.form";
import RoleApplicationForm from "../forms/role-application.form";
import { useDeleteRole } from "../hooks/use-project-role.hook";
import { ProjectRole } from "../types/project-role.type";
import { KeyFeature, ProjectGoal, TechStack } from "../types/project.type";

interface RoleCardProps {
  role: ProjectRole;
  projectGoals?: ProjectGoal[];
  keyFeatures?: KeyFeature[];
  className?: string;
  isMaintainer?: boolean;
  projectId?: string;
}

// Fonction pour tronquer le texte
const truncateText = (text: string, maxLength: number = 120) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

export default function RoleCard({
  role,
  projectGoals = [],
  keyFeatures = [],
  className,
  isMaintainer = false,
  projectId = "",
}: RoleCardProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { deleteRole, isDeleting } = useDeleteRole(projectId, role.id);
  const { isAuthenticated, redirectToLogin } = useAuth();
  const {
    title = "",
    description = "",
    techStacks: roleTechStacks = [],
  } = role;

  const handleCheckClick = () => {
    if (!isMaintainer && !isAuthenticated) {
      redirectToLogin();
    }
  };

  const cardContent = (
    <div
      className={`w-full rounded-[20px] border border-[black]/6 px-6.5 py-4 pt-7 transition-all duration-200 hover:cursor-pointer hover:shadow-[0_0_8px_rgba(0,0,0,0.1)] ${className}`}
      onClick={handleCheckClick}
    >
      {/* Role Title */}
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-medium tracking-tighter text-black">
          {role.title}
        </h3>
        {isMaintainer ? (
          <div className="flex items-center gap-1">
            <EditRoleForm role={role} projectId={projectId}>
              <Button variant="ghost" size="icon">
                <Icon name="pencil" size="sm" />
              </Button>
            </EditRoleForm>

            <ConfirmDialog
              open={isConfirmOpen}
              onOpenChange={setIsConfirmOpen}
              title="Supprimer le rôle"
              description="Êtes-vous sûr de vouloir supprimer ce rôle ? Cette action est irréversible."
              isLoading={isDeleting}
              onConfirm={() => {
                deleteRole();
                setIsConfirmOpen(false);
              }}
              onCancel={() => setIsConfirmOpen(false)}
              confirmText="Supprimer le rôle"
              confirmIcon="trash"
              confirmIconVariant="white"
              confirmVariant="destructive"
            />
            <Button
              onClick={() => setIsConfirmOpen(true)}
              variant="ghost"
              size="icon"
            >
              <Icon name="trash" size="sm" />
            </Button>
          </div>
        ) : (
          <div className="flex cursor-pointer items-center gap-1 opacity-35 transition-opacity hover:opacity-40">
            <span className="text-xs text-black sm:text-sm">
              Candidater à ce rôle
            </span>
            <Icon name="arrow-up-right" size="xs" />
          </div>
        )}
      </div>

      {/* Role Description */}
      <p className="mt-4 text-sm leading-snug font-medium tracking-tighter text-black/70">
        {truncateText(description, 90)}
      </p>

      {/* Ligne de séparation */}
      <div className="my-4 border-t border-black/3"></div>

      {/* Bottom Section */}
      <div className="flex w-full items-center gap-3 overflow-hidden text-xs">
        {/* Tech Badges */}
        <div className="flex gap-3">
          {roleTechStacks.length > 0 &&
            roleTechStacks.map((techStack: TechStack) => (
              <div key={`${techStack.id}`} className="relative flex-shrink-0">
                <StackLogo
                  name={techStack.name}
                  icon={techStack.iconUrl || ""}
                  alt={techStack.name}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  if (!isMaintainer && isAuthenticated) {
    return (
      <RoleApplicationForm
        roleTitle={title}
        roleDescription={description}
        projectGoals={projectGoals}
        keyFeatures={keyFeatures}
        techStacks={roleTechStacks}
        projectId={projectId}
        roleId={role.id}
      >
        {cardContent}
      </RoleApplicationForm>
    );
  }

  return cardContent;
}
