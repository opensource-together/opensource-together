import { ReactNode } from "react";

import FooterLogin from "@/shared/components/layout/footer-login";

import DashboardSidebar from "@/features/dashboard/components/layout/dashboard-sidebar.component";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-65px)] flex-col md:min-h-[calc(99vh-85px)]">
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="mx-7 flex-1 overflow-y-auto pt-8 lg:mx-0 lg:ml-52">
          <div className="max-w-[708px]">
            {children}

            <FooterLogin />
          </div>
        </main>
      </div>
    </div>
  );
}
