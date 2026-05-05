import type { Metadata } from "next";
import type { ReactNode } from "react";

import DashboardSidebar from "@/features/dashboard/components/layout/dashboard-sidebar.component";

export const metadata: Metadata = {
  title: {
    template: "%s | Dashboard | OpenSource Together",
    default: "Dashboard | OpenSource Together",
  },
  description: "Dashboard for OpenSource Together",
  robots: {
    index: false,
    follow: false,
  },
};
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-6.5rem)] min-h-0 flex-col">
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="mx-7 flex min-h-0 flex-1 flex-col overflow-hidden lg:mx-14">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mt-2">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
