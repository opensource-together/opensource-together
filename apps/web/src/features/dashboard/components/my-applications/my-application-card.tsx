"use client";

import StackLogo from "@/shared/components/logos/stack-logo";
import { Avatar } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";

import { ProjectRoleApplicationType } from "../../types/project-role-application.type";

const STATUS_STYLES = {
  PENDING: { bg: "bg-yellow-100", text: "text-yellow-800" },
  ACCEPTED: { bg: "bg-green-100", text: "text-green-800" },
  REJECTED: { bg: "bg-red-100", text: "text-red-800" },
} as const;

interface MyApplicationsCardProps {
  application: ProjectRoleApplicationType;
  onClick?: () => void;
  isSelected?: boolean;
}

export function MyApplicationsCard({
  application,
  onClick,
  isSelected,
}: MyApplicationsCardProps) {
  return (
    <div
      className={`w-full rounded-[20px] border border-[black]/6 px-4 py-4 pt-7 transition-all duration-200 hover:cursor-pointer hover:shadow-[0_0_8px_rgba(0,0,0,0.1)] sm:px-6.5 ${
        isSelected ? "shadow-[0_0_8px_rgba(0,0,0,0.1)]" : ""
      }`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start sm:gap-0">
        <div className="flex items-start gap-4">
          <Avatar
            src={application.project.image}
            name={application.project.title}
            alt={application.project.title}
            size="lg"
          />
          <div>
            <h3 className="text-base font-medium tracking-tighter text-black sm:text-lg">
              {application.projectRole.title} - {application.project.title}
            </h3>
            <p className="text-muted-foreground -mt-1 text-sm tracking-tighter">
              by {application.project.author.name}
            </p>
          </div>
        </div>
        <Badge
          className={`self-start px-2 py-1 sm:self-auto ${
            STATUS_STYLES[application.status as keyof typeof STATUS_STYLES]?.bg
          } ${
            STATUS_STYLES[application.status as keyof typeof STATUS_STYLES]
              ?.text
          }`}
        >
          {application.status}
        </Badge>
      </div>

      {/* Description */}
      <p className="mt-4 line-clamp-1 text-sm leading-5 font-medium tracking-tighter">
        {application.project.shortDescription}
      </p>

      {/* Divider */}
      <div className="my-4 border-t border-black/3" />

      {/* Footer */}
      <div className="flex w-full flex-col items-start justify-between gap-4 overflow-hidden text-xs sm:flex-row sm:items-center sm:gap-0">
        <div className="flex gap-5">
          {application.projectRole.techStacks.slice(0, 3).map((tech) => (
            <StackLogo
              key={tech.id}
              name={tech.name}
              icon={tech.iconUrl || ""}
              alt={tech.name}
            />
          ))}
          {application.projectRole.techStacks.length > 3 && (
            <span className="flex h-5.5 flex-shrink-0 items-center rounded-full bg-transparent text-xs whitespace-nowrap text-black/20">
              +{application.projectRole.techStacks.length - 3}
            </span>
          )}
        </div>
        <p className="text-muted-foreground">
          Envoyée le {new Date(application.appliedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
