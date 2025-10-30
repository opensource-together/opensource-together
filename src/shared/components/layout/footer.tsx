"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Separator } from "@/shared/components/ui/separator";

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
      href: "/guide",
      id: "resources-oss-guide",
    },
  ],
  company: [
    {
      label: "GitHub",
      href: "https://github.com/opensource-together",
      external: true,
      id: "company-github",
    },
    {
      label: "Discord",
      href: "https://discord.gg/4ZDhm3dQAC",
      external: true,
      id: "company-discord",
    },
    {
      label: "X",
      href: "https://x.com/OpenSTogether",
      external: true,
      id: "company-x",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/opensource-together",
      external: true,
      id: "company-linkedin",
    },
  ],
  legal: [
    {
      label: "Terms and Conditions",
      href: "#",
      id: "legal-terms",
    },
    {
      label: "Privacy Policy",
      href: "#",
      id: "legal-privacy",
    },
  ],
};

const renderLinkSection = (title: string, links: FooterLink[]) => (
  <div>
    <h4 className="text-foreground mb-5 text-xs font-medium md:mb-6 md:text-sm">
      {title}
    </h4>
    <ul className="text-muted-foreground space-y-5 text-xs md:text-sm">
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
  const hideFooter =
    pathname.startsWith("/projects/create") ||
    pathname.startsWith("/dashboard") ||
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
              <div className="gap- grid w-full grid-cols-3 text-xs md:ml-auto md:w-auto md:grid-cols-3 md:gap-14 md:text-sm">
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
