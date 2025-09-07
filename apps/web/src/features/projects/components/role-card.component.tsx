"use client";

import { useState } from "react";
import { GoArrowUpRight } from "react-icons/go";

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
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-medium tracking-tighter text-black">
          {role.title}
        </h3>
        {isMaintainer && (
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
        )}
      </div>

      <p className="mt-4 text-sm leading-snug font-medium tracking-tighter text-black/70">
        {truncateText(description, 90)}
      </p>

      <div className="my-4 border-t border-black/3"></div>

      <div className="flex w-full items-center justify-between">
        <div className="flex gap-3 overflow-hidden text-xs">
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
        {!isMaintainer && (
          <div className="flex cursor-pointer items-center gap-0">
            <span className="text-primary text-sm">Candidater à ce rôle</span>
            <GoArrowUpRight className="text-primary mt-1 size-4" />
          </div>
        )}
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
