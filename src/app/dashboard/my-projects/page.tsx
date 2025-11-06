import { Metadata } from "next";

import MyProjectsView from "@/features/dashboard/views/projects/my-projects.view";

export const metadata: Metadata = {
  title: "My Projects",
  description: "Manage your projects on OpenSource Together",
};

export default function MyProjectsPage() {
  return <MyProjectsView />;
}
