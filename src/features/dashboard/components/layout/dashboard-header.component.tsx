"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import "@/shared/components/ui/breadcrumb-navigation";
import { Button } from "@/shared/components/ui/button";
import HeaderBreadcrumb from "@/shared/components/ui/header-breadcrumb.component";
import Icon from "@/shared/components/ui/icon";
import {
  SkeletonBreadcrumb,
  SkeletonNotificationPanel,
  SkeletonUserDropdown,
} from "@/shared/components/ui/skeleton-header";
import UserDropdown from "@/shared/components/ui/user-dropdown.component";

import useAuth from "@/features/auth/hooks/use-auth.hook";
import SearchModal from "@/features/projects/components/search-modal";

export default function DashboardHeader() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  if (pathname.startsWith("/auth") || pathname.startsWith("/onboarding")) {
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
              className={pathname.startsWith("/projects") ? "bg-accent" : ""}
              size="sm"
              onClick={() => setIsSearchOpen(true)}
            >
              <Icon
                name="search"
                size="sm"
                variant="default"
                className="mr-0"
              />{" "}
              <span>Search</span>
            </Button>
            <Button
              variant="ghost"
              className={pathname.startsWith("/dashboard") ? "bg-accent" : ""}
              size="sm"
            >
              <Link href="/dashboard/my-projects">Dashboard</Link>
            </Button>
            <Button
              variant="ghost"
              className={pathname.startsWith("/about") ? "bg-accent" : ""}
              size="sm"
            >
              <Link href="/about">About</Link>
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
      <SearchModal open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </div>
  );
}
