"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import "@/shared/components/ui/breadcrumb-navigation";
import { Button } from "@/shared/components/ui/button";
import HeaderBreadcrumb from "@/shared/components/ui/header-breadcrumb.component";
import {
  SkeletonBreadcrumb,
  SkeletonNotificationPanel,
  SkeletonUserDropdown,
} from "@/shared/components/ui/skeleton-header";
import UserDropdown from "@/shared/components/ui/user-dropdown.component";

import useAuth from "@/features/auth/hooks/use-auth.hook";

export default function DashboardHeader() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  if (pathname.startsWith("/auth")) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-between px-10">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image
              src="/ostogether-logo.svg"
              alt="ost-logo"
              width={250}
              height={12}
              className="py-8"
            />
          </Link>
          {isLoading ? <SkeletonBreadcrumb /> : <HeaderBreadcrumb />}
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

          {isLoading ? (
            <>
              <SkeletonNotificationPanel />
              <SkeletonUserDropdown />
            </>
          ) : isAuthenticated ? (
            <>
              <UserDropdown />
            </>
          ) : (
            <Link href="/auth/login">
              <Button variant="default">Se connecter</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
