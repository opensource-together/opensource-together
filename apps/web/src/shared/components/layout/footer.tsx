"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const hideFooter =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/projects/create") ||
    pathname.startsWith("/dashboard");

  const navigationLinks = [
    { name: "Accueil", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: "Mentions légales", href: "/legal-notice" },
    { name: "Politique de confidentialité", href: "/privacy-policy" },
    { name: "Conditions d'utilisation", href: "/terms-of-service" },
  ];
  return (
    <>
      {!hideFooter && (
        <>
          <footer className="mx-4 max-w-7xl py-10 md:mx-auto md:px-7">
            <div className="mx-auto my-10 h-[1px] w-11/12 bg-black/5 md:w-full" />
            <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between lg:gap-0">
              <Link href="/" className="mb-4 flex items-center md:mb-0">
                <Image
                  src="/ostogether-logo.svg"
                  alt="ost-logo"
                  width={31}
                  height={25}
                  className="h-auto max-h-[25px] w-auto md:max-h-[30px]"
                />
              </Link>

              <nav className="flex flex-wrap items-center justify-center gap-4 text-xs md:gap-6 md:text-sm">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="tracking-tight text-black/70 transition hover:text-black"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          </footer>
        </>
      )}
    </>
  );
}
