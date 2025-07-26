import { ReactNode } from "react";

import DashboardSidebar from "@/features/dashboard/components/layout/dashboard-sidebar.component";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-65px)] overflow-hidden md:h-[calc(100vh-85px)]">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto px-4 pt-12 sm:px-14">
        {children}
      </main>
    </div>
  );
}
