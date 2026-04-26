"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
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
import { cn } from "@/shared/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  const navContainerRef = useRef<HTMLDivElement>(null);
  const [blobStyle, setBlobStyle] = useState<React.CSSProperties>({
    opacity: 0,
    width: 0,
    transform: "translateX(0px)",
  });
  const isFirstEnterRef = useRef(true);

  const handleNavItemEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = navContainerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const targetRect = e.currentTarget.getBoundingClientRect();
    const x = targetRect.left - containerRect.left;
    if (isFirstEnterRef.current) {
      isFirstEnterRef.current = false;
      setBlobStyle({
        opacity: 1,
        width: targetRect.width,
        transform: `translateX(${x}px)`,
        transition: "opacity 150ms ease-out",
      });
    } else {
      setBlobStyle({
        opacity: 1,
        width: targetRect.width,
        transform: `translateX(${x}px)`,
        transition:
          "transform 200ms ease-out, width 200ms ease-out, opacity 150ms ease-out",
      });
    }
  };

  const handleNavLeave = () => {
    isFirstEnterRef.current = true;
    setBlobStyle((prev) => ({
      ...prev,
      opacity: 0,
      transition: "opacity 150ms ease-out",
    }));
  };

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
          <div
            ref={navContainerRef}
            className="relative flex items-center gap-1 md:mr-2"
            onMouseLeave={handleNavLeave}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute top-0 h-full rounded-full bg-accent"
              style={blobStyle}
            />
            <div onMouseEnter={handleNavItemEnter} className="relative">
              <SearchCommand noHoverBg onOpen={handleNavLeave} />
            </div>
            {isAuthenticated && (
              <>
                <div onMouseEnter={handleNavItemEnter} className="relative">
                  <Link href="/learn">
                    <Button
                      variant="ghost"
                      className={cn(
                        "hover:scale-100 hover:bg-transparent active:scale-100",
                        pathname.startsWith("/learn")
                          ? "bg-accent hover:bg-accent"
                          : ""
                      )}
                      size="sm"
                    >
                      Learn
                    </Button>
                  </Link>
                </div>
                <div onMouseEnter={handleNavItemEnter} className="relative">
                  <Link href="/dashboard/my-projects">
                    <Button
                      variant="ghost"
                      className={cn(
                        "hover:scale-100 hover:bg-transparent active:scale-100",
                        pathname.startsWith("/dashboard")
                          ? "bg-accent hover:bg-accent"
                          : ""
                      )}
                      size="sm"
                    >
                      My Projects
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>

          {isLoading ? (
            <SkeletonUserDropdown />
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/projects/create">
                <Button className="pr-[14px] pl-4 has-[>svg]:pr-[14px] has-[>svg]:pl-4">
                  Submit Project
                  <HiPlus size={16} />
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    className="hover:scale-100 active:scale-100"
                  >
                    Sign In
                  </Button>
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
