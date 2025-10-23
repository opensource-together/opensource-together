"use client";

import { Suspense } from "react";

import { Separator } from "@/shared/components/ui/separator";

import DashboardHeading from "../../components/layout/dashboard-heading.component";
import MyProjectsList from "../../components/my-projects/my-projects-list.component";
import MyProjectsSkeleton from "../../components/skeletons/my-projects-skeleton.component";

export default function MyProjectsView() {
  return (
    <div>
      <DashboardHeading
        title="My Projects"
        description="Organize, review, edit, manage members, track progress, and handle projects — all in one space."
      />

      <Separator className="my-4" />

      <Suspense fallback={<MyProjectsSkeleton />}>
        <MyProjectsList />
      </Suspense>
    </div>
  );
}
