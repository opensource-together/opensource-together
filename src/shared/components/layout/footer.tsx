"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Separator } from "@/shared/components/ui/separator";

export default function Footer() {
  const pathname = usePathname();
  const hideFooter =
    pathname.startsWith("/projects/create") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/onboarding");

  const navigationLinks = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard/my-projects" },
    { name: "X / Twitter", href: "https://x.com/OpenSTogether" },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/opensource-together",
    },
  ];
  return (
    <>
      {!hideFooter && (
        <>
          <footer className="mx-4 max-w-7xl pt-0 pb-3 md:mx-auto md:px-7 md:pb-5">
            <Separator className="mx-auto mb-3 w-11/12 md:mb-8 lg:mb-5 lg:w-full" />
            <div className="flex w-full flex-col items-center gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
              <div className="flex w-full items-center justify-center gap-4 md:w-auto md:justify-start md:gap-6">
                <Link href="/" className="flex items-center">
                  <Image
                    src="icons/ost-logo-rounded.svg"
                    alt="ost-logo"
                    width={39}
                    height={39}
                    className="h-auto max-h-[39px] w-auto md:max-h-[39px]"
                  />
                </Link>

                <nav className="flex flex-wrap items-center justify-center gap-4 text-xs md:justify-start md:gap-6 md:text-sm">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="tracking-tight text-neutral-500 transition hover:text-neutral-700"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="flex items-center gap-4 text-xs md:text-sm">
                <span
                  className="flex items-center gap-1"
                  style={{ color: "var(--ost-blue-three)" }}
                >
                  <Image
                    src="/icons/blue-dot.svg"
                    alt="all-systems-normal"
                    width={6}
                    height={6}
                  />{" "}
                  All systems normal
                </span>
                <span className="text-muted-foreground">
                  © OpenSource Together • 2025
                </span>
              </div>
            </div>
          </footer>
        </>
      )}
    </>
  );
}
