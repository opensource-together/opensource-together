"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiPlus } from "react-icons/hi2";

import HeaderBreadcrumb from "@/shared/components/layout/header-breadcrumb.component";
import LogoDropdown from "@/shared/components/layout/logo-dropdown.component";
import { MobileHeader } from "@/shared/components/layout/mobile-header.component";
import "@/shared/components/ui/breadcrumb-navigation";

import useAuth from "@/features/auth/hooks/use-auth.hook";
import SearchCommand from "@/features/projects/components/search-command.component";
import { Button } from "@/shared/components/ui/button";
import { SkeletonUserDropdown } from "@/shared/components/ui/skeleton-header";
import UserDropdown from "@/shared/components/ui/user-dropdown.component";

export default function Header() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  if (pathname.startsWith("/auth") || pathname.startsWith("/onboarding")) {
    return null;
  }

  return (
    <>
      <MobileHeader />

      <header className="relative sticky top-0 z-40 hidden justify-between px-10 pt-4 pb-9 md:flex">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 -z-10 backdrop-blur-2xl [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)] [mask-image:linear-gradient(to_bottom,black,transparent)]"
          aria-hidden
        />
        <div className="relative z-10 flex items-center gap-4">
          {pathname === "/" ? (
            <LogoDropdown />
          ) : (
            <Link
              href="/"
              aria-label="OpenSource Together Home"
              className="transition-opacity duration-200 ease-out hover:opacity-50"
            >
              <Image
                src="/ostogether-logo.svg"
                alt="ost-logo"
                width={210}
                height={50}
              />
            </Link>
          )}
          <HeaderBreadcrumb />
        </div>
        <nav
          className="relative z-10 flex items-center gap-2"
          aria-label="Main navigation"
        >
          <div className="flex items-center gap-1 md:mr-2">
            <SearchCommand />
            {isAuthenticated && (
              <>
                <Link href="/dashboard/my-projects">
                  <Button
                    variant="ghost"
                    className={
                      pathname.startsWith("/dashboard") ? "bg-accent" : ""
                    }
                    size="sm"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Link href="/learn">
                  <Button
                    variant="ghost"
                    className={pathname.startsWith("/learn") ? "bg-accent" : ""}
                    size="sm"
                  >
                    Learn
                  </Button>
                </Link>
              </>
            )}
          </div>

          {isLoading ? (
            <SkeletonUserDropdown />
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
