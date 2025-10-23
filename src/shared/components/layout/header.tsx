"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import HeaderBreadcrumb from "@/shared/components/layout/header-breadcrumb.component";
import "@/shared/components/ui/breadcrumb-navigation";
import { Button } from "@/shared/components/ui/button";
import { SkeletonUserDropdown } from "@/shared/components/ui/skeleton-header";
import UserDropdown from "@/shared/components/ui/user-dropdown.component";

import useAuth from "@/features/auth/hooks/use-auth.hook";
import SearchCommand from "@/features/projects/components/search-command.component";

export default function Header() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  if (pathname.startsWith("/auth") || pathname.startsWith("/onboarding")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 flex justify-between bg-white/50 px-10 py-4 backdrop-blur-2xl">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Image
            src="/ostogether-logo.svg"
            alt="ost-logo"
            width={200}
            height={50}
          />
        </Link>
        <HeaderBreadcrumb />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <SearchCommand />
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
            <SkeletonUserDropdown />
          </>
        ) : isAuthenticated ? (
          <>
            <UserDropdown />
          </>
        ) : (
          <Link href="/auth/login">
            <Button variant="default">Sign In</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
