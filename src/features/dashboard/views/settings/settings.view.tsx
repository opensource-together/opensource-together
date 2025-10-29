"use client";

import { SelectSeparator } from "@/shared/components/ui/select";

import DashboardHeading from "../../components/layout/dashboard-heading.component";
import { SettingsContent } from "../../components/settings/settings-content.component";

export default function SettingsView() {
  return (
    <>
      <DashboardHeading
        title="Settings"
        description="Manage your account settings and connected integrations."
      />

      <SelectSeparator className="my-4" />

      <SettingsContent />
    </>
  );
}
