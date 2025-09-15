import { ReactNode } from "react";

import DashboardSidebar from "@/features/dashboard/components/layout/dashboard-sidebar.component";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-65px)] overflow-hidden md:h-[calc(99vh-85px)]">
      <DashboardSidebar />
      <main className="mx-7 flex-1 overflow-y-auto pt-8 lg:mx-0 lg:ml-52">
        <div className="max-w-[708px]">{children}</div>
      </main>
    </div>
  );
}
