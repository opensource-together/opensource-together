import { ReactNode } from "react";

import DashboardClientProviderWrapper from "@/features/dashboard/components/dashboard-client-provider-wrapper";
import DashboardSidebar from "@/features/dashboard/components/dashboard-sidebar.component";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardClientProviderWrapper>
      <div className="flex h-[calc(100vh-65px)] overflow-hidden md:h-[calc(100vh-85px)]">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto px-14 pt-12">{children}</main>
      </div>
    </DashboardClientProviderWrapper>
  );
}
