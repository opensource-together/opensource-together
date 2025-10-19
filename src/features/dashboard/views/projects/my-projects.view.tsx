"use client";

import { HiMiniSquare2Stack } from "react-icons/hi2";

import { Separator } from "@/shared/components/ui/separator";

import DashboardHeading from "../../components/layout/dashboard-heading.component";
import MyProjectsList from "../../components/my-projects/my-projects-list.component";

export default function MyProjectsView() {
  return (
    <div>
      <DashboardHeading
        title="My Projects"
        icon={<HiMiniSquare2Stack size={16} />}
        description="Organize, review, edit, manage members, track progress, and handle projects — all in one space."
      />

      <Separator className="my-4" />

      <MyProjectsList />
    </div>
  );
}
