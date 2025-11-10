"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiPlus } from "react-icons/hi2";

import HeaderBreadcrumb from "@/shared/components/layout/header-breadcrumb.component";
import { MobileHeader } from "@/shared/components/layout/mobile-header.component";
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
    <>
      <MobileHeader />

      <header className="sticky top-0 z-40 hidden justify-between bg-white/50 px-10 py-4 backdrop-blur-2xl md:flex">
        <div className="flex items-center gap-4">
          <Link href="/" aria-label="OpenSource Together Home">
            <Image
              src="/ostogether-logo.svg"
              alt="ost-logo"
              width={200}
              height={50}
            />
          </Link>
          <HeaderBreadcrumb />
        </div>
        <nav className="flex items-center gap-2" aria-label="Main navigation">
          <div className="flex items-center gap-1 md:mr-2">
            <SearchCommand />
            <Link href="/dashboard/my-projects">
              <Button
                variant="ghost"
                className={pathname.startsWith("/dashboard") ? "bg-accent" : ""}
                size="sm"
              >
                Dashboard
              </Button>
            </Link>
            <Link href="/oss-guide">
              <Button
                variant="ghost"
                className={pathname.startsWith("/oss-guide") ? "bg-accent" : ""}
                size="sm"
              >
                Guide
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <>
              <SkeletonUserDropdown />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/projects/create">
                <Button>
                  Create Project
                  <HiPlus size={16} />
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link href="/auth/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
              )}
              {isAuthenticated && <UserDropdown />}
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
