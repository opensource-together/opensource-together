import { ReactNode } from "react";

import DashboardSidebar from "@/features/dashboard/components/layout/dashboard-sidebar.component";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-65px)] overflow-hidden md:h-[calc(100vh-85px)]">
      <DashboardSidebar />
      <main className="mx-7 mt-8 max-w-[708px] flex-1 overflow-y-auto lg:ml-52">
        {children}
      </main>
    </div>
  );
}
