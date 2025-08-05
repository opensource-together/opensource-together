"use client";

import { useState } from "react";

import { ApplicationType, TeamMemberType } from "../../types/my-projects.type";
import MyApplicationsReceived from "./my-applications-received.component";
import MyTeamMembers from "./my-team-members.component";

interface MyProjectTabsProps {
  applications: ApplicationType[];
  teamMembers?: TeamMemberType[];
  isLoading?: boolean;
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
  onApplicationDecision,
}: MyProjectTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("applications");

  const tabs = [
    {
      id: "applications" as TabType,
      label: "Candidatures",
      count: applications.length,
    },
    {
      id: "members" as TabType,
      label: "Membres du projet",
      count: teamMembers.length,
    },
  ];

  return (
    <div className="sticky top-0 z-10">
      {/* Tabs */}
      <div className="flex border-b border-black/10 tracking-tighter">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
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
        {activeTab === "applications" && (
          <MyApplicationsReceived
            applications={applications}
            isLoading={isLoading}
            onApplicationDecision={onApplicationDecision}
          />
        )}
        {activeTab === "members" && (
          <MyTeamMembers members={teamMembers} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}
