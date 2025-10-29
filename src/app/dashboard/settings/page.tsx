import { Metadata } from "next";

import SettingsView from "@/features/dashboard/views/settings/settings.view";

export const metadata: Metadata = {
  title: "Settings | Dashboard | OpenSource Together",
  description: "Manage your account settings and connected integrations.",
};

export default function SettingsPage() {
  return <SettingsView />;
}
