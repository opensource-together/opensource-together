"use client";

import { useState } from "react";

import { ApplicationReceived, TeamMember } from "../../types/my-projects.type";
import MyApplicationsReceived from "./my-applications-received.component";
import MyTeamMembers from "./my-team-members.component";

// Mock data for the team members (to be replaced by your real data)
const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Byron Love",
    avatarUrl: "/icons/exemplebyronIcon.svg",
    role: "Frontend Developer",
    joinedAt: "2024-01-15",
    techStacks: [
      { id: "1", name: "React" },
      { id: "2", name: "TypeScript" },
      { id: "3", name: "Tailwind" },
    ],
  },
  {
    id: "2",
    name: "Jane Smith",
    avatarUrl: "/icons/exemplebyronIcon.svg",
    role: "Backend Developer",
    joinedAt: "2024-01-20",
    techStacks: [
      { id: "4", name: "Node.js" },
      { id: "5", name: "PostgreSQL" },
    ],
  },
];

interface MyProjectTabsProps {
  applications: ApplicationReceived[];
  teamMembers?: TeamMember[];
  onApplicationDecision?: (
    applicationId: string,
    decision: "ACCEPTED" | "REJECTED",
    reason?: string
  ) => void;
}

type TabType = "applications" | "members";

export default function MyProjectTabs({
  applications,
  teamMembers = mockTeamMembers,
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
    <div>
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
            onApplicationDecision={onApplicationDecision}
          />
        )}
        {activeTab === "members" && <MyTeamMembers members={teamMembers} />}
      </div>
    </div>
  );
}
