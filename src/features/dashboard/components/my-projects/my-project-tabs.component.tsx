"use client";

import { useEffect, useMemo, useState } from "react";

import { TechStackType } from "@/shared/types/tech-stack.type";

import { TeamMemberType } from "../../types/my-projects.type";
import MyTeamMembers from "./my-team-members.component";

interface MyProjectTabsProps {
  projectId: string;
  isLoading?: boolean;
  projectOwnerId?: string;
  currentUserId?: string;
  isAuthLoading?: boolean;
  projectOwner?: {
    id: string;
    username: string;
    avatarUrl?: string;
    techStacks?: TechStackType[];
  };
}

type TabType = "applications" | "members";

export default function MyProjectTabs({
  // projectId,
  isLoading = false,
  projectOwnerId,
  currentUserId,
  isAuthLoading = false,
  projectOwner,
}: MyProjectTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("members");

  const canViewApplications =
    projectOwnerId && currentUserId && projectOwnerId === currentUserId;

  const isAuthDataReady = !isAuthLoading && projectOwnerId && currentUserId;
  const shouldDisableApplications = isAuthDataReady && !canViewApplications;

  const allTeamMembers: TeamMemberType[] = useMemo(() => {
    if (!projectOwner || !projectOwnerId) return [];

    const ownerExists = allTeamMembers.some(
      (member: TeamMemberType) => member.id === projectOwnerId
    );
    if (ownerExists) return allTeamMembers;

    const ownerAsMember: TeamMemberType = {
      id: projectOwner.id,
      name: projectOwner.username,
      avatarUrl: projectOwner.avatarUrl || null,
      joinedAt: new Date(),
      techStacks: projectOwner.techStacks || [],
    };

    return [ownerAsMember, ...allTeamMembers];
  }, [projectOwner, projectOwnerId]);

  const tabs = [
    {
      id: "members" as TabType,
      label: "Membres du projet",
      count: allTeamMembers.length,
      disabled: false,
    },
  ];

  useEffect(() => {
    if (shouldDisableApplications && activeTab === "members") {
      setActiveTab("members");
    }
  }, [shouldDisableApplications, activeTab, allTeamMembers]);

  return (
    <div className="sticky top-0 z-10">
      <div className="flex border-b border-black/10 tracking-tighter">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            disabled={!!tab.disabled}
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
                {tab.count || 0}
              </span>
            )}
            {activeTab === tab.id && (
              <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-black/50" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-6">
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
