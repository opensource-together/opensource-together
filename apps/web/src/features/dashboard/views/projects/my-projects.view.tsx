"use client";

import { HiMiniSquare2Stack } from "react-icons/hi2";

import { Separator } from "@/shared/components/ui/separator";

import DashboardCtaComponent from "../../components/layout/dashboard-cta.component";
import DashboardHeading from "../../components/layout/dashboard-heading.component";
import MyProjectsList from "../../components/my-projects/my-projects-list.component";
import {
  useAcceptProjectRoleApplication,
  useRejectProjectRoleApplication,
} from "../../hooks/use-project-role-application.hook";

export default function MyProjectsView() {
  const acceptApplicationMutation = useAcceptProjectRoleApplication();
  const rejectApplicationMutation = useRejectProjectRoleApplication();

  const handleApplicationDecision = (
    applicationId: string,
    decision: "ACCEPTED" | "REJECTED"
  ) => {
    if (decision === "ACCEPTED") {
      acceptApplicationMutation.acceptApplication(applicationId);
    } else {
      rejectApplicationMutation.rejectApplication(applicationId);
    }
  };

  return (
    <div>
      <DashboardHeading
        title="Projets"
        icon={<HiMiniSquare2Stack size={16} />}
        description="Organisez, modifiez, gérez les membres et administrez vos projets — tout en un seul endroit."
      />
      <DashboardCtaComponent />

      <Separator className="my-10" />

      <div className="w-full">
        <MyProjectsList />
      </div>
    </div>
  );
}
