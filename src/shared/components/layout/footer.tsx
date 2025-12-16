"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Separator } from "@/shared/components/ui/separator";
import { EXTERNAL_LINKS } from "@/shared/lib/constants";

type FooterLink = {
  label: string;
  href: string;
  id: string;
  external?: boolean;
};

const footerLinks: {
  developers: FooterLink[];
  resources: FooterLink[];
  company: FooterLink[];
  legal: FooterLink[];
} = {
  developers: [
    // kept for typing shape, not rendered
  ],
  resources: [
    {
      label: "OSS Guide",
      href: "/oss-guide",
      id: "resources-oss-guide",
    },
    {
      label: "OST Linker",
      href: EXTERNAL_LINKS.OST_Linker,
      external: true,
      id: "developers-ost-linker",
    },
  ],
  company: [
    {
      label: "GitHub",
      href: EXTERNAL_LINKS.GITHUB_ORG,
      external: true,
      id: "company-github",
    },
    {
      label: "Discord",
      href: EXTERNAL_LINKS.DISCORD,
      external: true,
      id: "company-discord",
    },
    {
      label: "X (Twitter)",
      href: EXTERNAL_LINKS.TWITTER,
      external: true,
      id: "company-x",
    },
    {
      label: "LinkedIn",
      href: EXTERNAL_LINKS.LINKEDIN,
      external: true,
      id: "company-linkedin",
    },
  ],
  legal: [
    {
      label: "Terms and Conditions",
      href: "/terms-and-conditions",
      id: "legal-terms",
    },
    {
      label: "Privacy Policy",
      href: "/privacy-policy",
      id: "legal-privacy",
    },
  ],
};

const renderLinkSection = (title: string, links: FooterLink[]) => (
  <div>
    <h2 className="text-foreground mb-5 text-sm font-medium md:mb-6 md:text-sm">
      {title}
    </h2>
    <ul className="text-muted-foreground space-y-5 text-sm md:text-sm">
      {links.map((link) => (
        <li key={link.id}>
          <Link
            className="hover:text-foreground transition"
            href={link.href}
            {...(link.external && {
              target: "_blank",
              rel: "noopener noreferrer",
            })}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default function Footer() {
  const pathname = usePathname();
  const [is404Page, setIs404Page] = useState(false);

  useEffect(() => {
    const checkFor404 = () => {
      if (typeof window !== "undefined") {
        const h1Element = document.querySelector("main h1");
        const is404 =
          h1Element?.textContent?.trim() === "404" ||
          document.title.includes("404 - Page Not Found");
        setIs404Page(is404);
      }
    };
    checkFor404();
    requestAnimationFrame(checkFor404);
  }, [pathname]);

  const hideFooter =
    is404Page ||
    pathname.startsWith("/projects/create") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/not-found") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/onboarding");

  return (
    <>
      {!hideFooter && (
        <>
          <footer className="mx-4 mb-8 max-w-6xl bg-white md:mx-auto">
            <Separator className="mx-auto mb-8 w-11/12 lg:w-full" />
            <div className="flex w-full flex-col items-start gap-10 md:flex-row md:items-start md:justify-between md:gap-12">
              {/* Left: Logo + copyright */}
              <div className="flex w-full flex-col items-start gap-4 md:w-auto">
                <Link href="/" className="flex items-center">
                  <Image
                    src="/ostogether-logo.svg"
                    alt="ost-logo"
                    width={50}
                    height={50}
                    className="h-auto max-h-[50px] w-auto md:max-h-[50px]"
                  />
                </Link>
                <span className="text-muted-foreground text-sm">
                  © OpenSource Together • 2025
                </span>
              </div>

              {/* Right: Link sections */}
              <div className="grid w-full grid-cols-2 md:w-auto md:grid-cols-3 md:gap-14 md:text-sm">
                {renderLinkSection("Resources", footerLinks.resources)}
                {renderLinkSection("Company", footerLinks.company)}
                <div className="mb-5 md:mb-5">
                  {renderLinkSection("Legal", footerLinks.legal)}
                </div>
              </div>
            </div>
          </footer>
        </>
      )}
    </>
  );
}
