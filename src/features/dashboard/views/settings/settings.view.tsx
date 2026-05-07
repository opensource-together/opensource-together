"use client";

import DashboardHeading from "../../components/layout/dashboard-heading.component";
import { SettingsContent } from "../../components/settings/settings-content.component";

export default function SettingsView() {
  return (
    <>
      <DashboardHeading
        title="Settings"
        description="Manage your account settings and connected integrations."
      />

      <SettingsContent />
    </>
  );
}
