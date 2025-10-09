"use client";

import { HiMiniSquare2Stack } from "react-icons/hi2";

import { Separator } from "@/shared/components/ui/separator";

import DashboardCtaComponent from "../../components/layout/dashboard-cta.component";
import DashboardHeading from "../../components/layout/dashboard-heading.component";
import MyProjectsList from "../../components/my-projects/my-projects-list.component";

export default function MyProjectsView() {
  return (
    <div>
      <DashboardHeading
        title="Projects"
        icon={<HiMiniSquare2Stack size={16} />}
        description="Organize, review, edit, manage members, track progress, and handle projects — all in one space."
      />
      <DashboardCtaComponent
        title="Build OpenSource Together"
        description="Create a new project, import a repository from Github or completly start from scratch."
        buttonText="Create a project"
        buttonLink="/projects/create"
      />

      <Separator className="my-10" />

      <div className="w-full">
        <MyProjectsList />
      </div>
    </div>
  );
}
