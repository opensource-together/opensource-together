"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/shared/components/ui/button";

import { NotificationPanel } from "@/features/notifications/components/notification-panel.component";

import UserDropdown from "./user-dropdown.component";

export default function DashboardHeader() {
  const pathname = usePathname();

  return (
    <div>
      <div className="flex justify-between px-10">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src="/ostogether-logo.svg"
              alt="ost-logo"
              width={250}
              height={12}
              className="py-8"
            />
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <div className="mr-2 flex items-center gap-2">
            <Button
              variant="ghost"
              className={pathname === "/" ? "bg-accent" : ""}
              size="sm"
            >
              <Link href="/">Home</Link>
            </Button>
            <Button
              variant="ghost"
              className={pathname.startsWith("/dashboard") ? "bg-accent" : ""}
              size="sm"
            >
              <Link href="/dashboard/my-projects">Dashboard</Link>
            </Button>
          </div>

          <NotificationPanel />

          <UserDropdown />
        </div>
      </div>
    </div>
  );
}
