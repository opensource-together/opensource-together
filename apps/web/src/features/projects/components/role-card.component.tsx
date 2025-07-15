"use client";

import { useState } from "react";

import StackLogo from "@/shared/components/logos/stack-logo";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import Icon from "@/shared/components/ui/icon";

import EditRoleForm from "../forms/edit-role.form";
import RoleApplicationForm from "../forms/role-application.form";
import { useDeleteRole } from "../hooks/use-project-role.hook";
import { ProjectRole } from "../types/project-role.type";
import { ProjectGoal, TechStack } from "../types/project.type";

interface RoleCardProps {
  role: ProjectRole;
  techStacks?: TechStack[];
  projectGoals?: ProjectGoal[];
  className?: string;
  isMaintainer?: boolean;
  projectId?: string;
}

export default function RoleCard({
  role,
  techStacks = [],
  projectGoals = [],
  className,
  isMaintainer = false,
  projectId = "",
}: RoleCardProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { deleteRole, isDeleting } = useDeleteRole(projectId, role.id);
  const {
    title = "",
    description = "",
    techStacks: roleTechStacks = [],
  } = role;

  return (
    <div
      className={`w-full max-w-[668px] rounded-[20px] border border-[black]/5 p-4 shadow-xs md:p-6 ${className}`}
    >
      {/* Role Title */}
      <div className="flex items-start justify-between">
        <h3 className="text-xl font-medium tracking-tighter text-black">
          {role.title}
        </h3>
        {isMaintainer ? (
          <div className="flex items-center gap-1">
            <EditRoleForm role={role} projectId={projectId}>
              <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full p-2 transition-colors hover:bg-black/5">
                <Icon name="pencil" variant="gray" size="sm" />
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
            />
            <button
              onClick={() => setIsConfirmOpen(true)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full p-2 transition-colors hover:bg-black/5"
            >
              <Icon name="cross" variant="gray" size="xs" />
            </button>
          </div>
        ) : (
          <RoleApplicationForm
            roleTitle={title}
            roleDescription={description}
            projectGoals={projectGoals}
            techStacks={roleTechStacks}
          >
            <div className="flex cursor-pointer items-center gap-1 opacity-35 transition-opacity hover:opacity-40">
              <span className="text-sm text-black">Candidater à ce rôle</span>
              <Icon name="arrow-up-right" size="xs" />
            </div>
          </RoleApplicationForm>
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
