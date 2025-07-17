"use client";

import NextImage from "next/image";
import { useState } from "react";

import StackLogo from "@/shared/components/logos/stack-logo";
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
  techStacks?: TechStack[];
  projectGoals?: ProjectGoal[];
  keyFeatures?: KeyFeature[];
  className?: string;
  isMaintainer?: boolean;
  projectId?: string;
}

export default function RoleCard({
  role,
  techStacks = [],
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

  return (
    <div
      className={`w-full rounded-[20px] border border-[black]/5 p-3 shadow-xs sm:p-4 md:w-[668px] md:p-6 ${className}`}
    >
      {/* Role Title */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-medium tracking-tighter text-black sm:text-xl">
          {role.title}
        </h3>
        {isMaintainer ? (
          <div className="flex items-center gap-1">
            <EditRoleForm role={role} projectId={projectId}>
              <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-black/5 p-2 transition-colors hover:bg-black/5 sm:h-9 sm:w-9 sm:p-2.5">
                <NextImage
                  src="/icons/edit-black-icon.svg"
                  alt="Modifier"
                  width={16}
                  height={16}
                  className="h-4 w-4 sm:h-[16px] sm:w-[16px]"
                />
              </button>
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
              confirmIcon="/icons/delete-white-icon.svg"
              confirmVariant="destructive"
            />
            <button
              onClick={() => setIsConfirmOpen(true)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-black/5 p-2 transition-colors hover:bg-black/5 sm:h-9 sm:w-9 sm:p-2.5"
            >
              <NextImage
                src="/icons/delete-icon.svg"
                alt="Supprimer"
                width={16}
                height={16}
                className="h-4 w-4 sm:h-[16px] sm:w-[16px]"
              />
            </button>
          </div>
        ) : isAuthenticated ? (
          <RoleApplicationForm
            roleTitle={title}
            roleDescription={description}
            projectGoals={projectGoals}
            keyFeatures={keyFeatures}
            techStacks={techStacks}
            projectId={projectId}
            roleId={role.id}
          >
            <div className="flex cursor-pointer items-center gap-1 opacity-35 transition-opacity hover:opacity-40">
              <span className="text-xs text-black sm:text-sm">
                Candidater à ce rôle
              </span>
              <Icon name="arrow-up-right" size="xs" />
            </div>
          </RoleApplicationForm>
        ) : (
          <div
            onClick={() => redirectToLogin()}
            className="flex cursor-pointer items-center gap-1 opacity-35 transition-opacity hover:opacity-40"
          >
            <span className="text-xs text-black sm:text-sm">
              Candidater à ce rôle
            </span>
            <Icon name="arrow-up-right" size="xs" />
          </div>
        )}
      </div>

      {/* Role Description */}
      <p className="mb-4 text-sm leading-relaxed tracking-tighter text-black/70 md:mb-6">
        {description}
      </p>

      {/* Ligne de séparation */}
      <div className="mb-3 w-full border-t border-black/5"></div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-0">
        {/* Tech Badges */}
        <div className="flex flex-wrap gap-2">
          {roleTechStacks.length > 0 &&
            roleTechStacks.map((techStack: TechStack) => (
              <StackLogo
                key={`${techStack.id}`}
                name={techStack.name}
                icon={techStack.iconUrl || ""}
                alt={techStack.name}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
