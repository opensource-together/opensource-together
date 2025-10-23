import { Metadata } from "next";

import MyProjectsView from "@/features/dashboard/views/projects/my-projects.view";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "My Projects | OpenSource Together",
    description: "Manage your projects on OpenSource Together",
  };
}

export default function MyProjectsPage() {
  return <MyProjectsView />;
}
