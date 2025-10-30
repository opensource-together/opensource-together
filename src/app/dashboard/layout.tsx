import { ReactNode } from "react";

import DashboardSidebar from "@/features/dashboard/components/layout/dashboard-sidebar.component";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-80px)] flex-col">
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="mx-7 flex flex-1 flex-col overflow-hidden lg:mx-0 lg:ml-36">
          <div className="flex-1 overflow-y-auto">
            <div className="mt-8 max-w-4xl md:mt-0">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
