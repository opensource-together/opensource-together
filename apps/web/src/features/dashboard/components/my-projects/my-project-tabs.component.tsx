"use client";

import { useEffect, useMemo, useState } from "react";

import { TechStack } from "@/features/projects/types/project.type";

import { ApplicationType, TeamMemberType } from "../../types/my-projects.type";
import MyApplicationsReceived from "./my-applications-received.component";
import MyTeamMembers from "./my-team-members.component";

interface MyProjectTabsProps {
  applications: ApplicationType[];
  teamMembers?: TeamMemberType[];
  isLoading?: boolean;
  projectOwnerId?: string;
  currentUserId?: string;
  projectOwner?: {
    id: string;
    username: string;
    avatarUrl?: string;
    techStacks?: TechStack[];
  };
  onApplicationDecision?: (
    applicationId: string,
    decision: "ACCEPTED" | "REJECTED",
    reason?: string
  ) => void;
}

type TabType = "applications" | "members";

export default function MyProjectTabs({
  applications,
  teamMembers = [],
  isLoading = false,
  projectOwnerId,
  currentUserId,
  projectOwner,
  onApplicationDecision,
}: MyProjectTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("applications");

  const canViewApplications =
    projectOwnerId && currentUserId && projectOwnerId === currentUserId;

  const allTeamMembers = useMemo(() => {
    if (!projectOwner || !projectOwnerId) return teamMembers;

    const ownerExists = teamMembers.some(
      (member) => member.id === projectOwnerId
    );
    if (ownerExists) return teamMembers;

    const ownerAsMember: TeamMemberType = {
      id: projectOwner.id,
      name: projectOwner.username,
      avatarUrl: projectOwner.avatarUrl || null,
      role: "Propriétaire",
      joinedAt: new Date(),
      techStacks: projectOwner.techStacks || [],
    };

    return [ownerAsMember, ...teamMembers];
  }, [teamMembers, projectOwner, projectOwnerId]);

  const tabs = [
    {
      id: "applications" as TabType,
      label: "Candidatures",
      count: applications.length,
      disabled: !canViewApplications,
    },
    {
      id: "members" as TabType,
      label: "Membres du projet",
      count: allTeamMembers.length,
      disabled: false,
    },
  ];

  useEffect(() => {
    if (!canViewApplications && activeTab === "applications") {
      setActiveTab("members");
    }
  }, [canViewApplications, activeTab]);

  return (
    <div className="sticky top-0 z-10">
      {/* Tabs */}
      <div className="flex border-b border-black/10 tracking-tighter">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            disabled={tab.disabled}
            className={`relative px-4 py-3 text-sm font-medium transition-colors ${
              tab.disabled
                ? "cursor-not-allowed text-black/30"
                : activeTab === tab.id
                  ? "text-black"
                  : "text-black/50 hover:text-black/70"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-2 rounded-full bg-black/10 px-2 py-0.5 text-xs">
                {tab.count}
              </span>
            )}
            {/* Active tab */}
            {activeTab === tab.id && (
              <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-black/50" />
            )}
          </button>
        ))}
      </div>

      {/* Content of the tabs */}
      <div className="mt-6">
        {activeTab === "applications" && canViewApplications && (
          <MyApplicationsReceived
            applications={applications}
            isLoading={isLoading}
            onApplicationDecision={onApplicationDecision}
          />
        )}
        {activeTab === "members" && (
          <MyTeamMembers
            members={allTeamMembers}
            isLoading={isLoading}
            projectOwnerId={projectOwnerId}
            currentUserId={currentUserId}
          />
        )}
      </div>
    </div>
  );
}
