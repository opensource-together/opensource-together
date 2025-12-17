import type { Metadata } from "next";

import SettingsView from "@/features/dashboard/views/settings/settings.view";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings and connected integrations.",
};

export default function SettingsPage() {
  return <SettingsView />;
}
