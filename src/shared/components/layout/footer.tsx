"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Separator } from "@/shared/components/ui/separator";

const footerLinks = {
  developers: [
    {
      label: "Documentation",
      href: "#",
    },
    {
      label: "Github",
      href: "https://github.com/opensource-together/opensource-together",
      external: true,
    },
  ],
  resources: [
    {
      label: "Changelog",
      href: "#",
    },
    {
      label: "Press Kit",
      href: "#",
    },
    {
      label: "Blog",
      href: "#",
    },
  ],
  company: [
    {
      label: "Contact",
      href: "#",
    },
    {
      label: "X (Twitter)",
      href: "https://x.com/OpenSTogether",
      external: true,
    },
    {
      label: "Legal",
      href: "#",
    },
  ],
};

const renderLinkSection = (
  title: string,
  links: typeof footerLinks.developers
) => (
  <div>
    <h4 className="text-foreground mb-5 font-medium md:mb-6">{title}</h4>
    <ul className="text-muted-foreground space-y-5 md:space-y-6">
      {links.map((link) => (
        <li key={link.href}>
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
          <footer className="mx-4 max-w-7xl bg-white md:mx-auto md:px-0">
            <Separator className="mx-auto mb-8 w-11/12 lg:w-full" />
            <div className="flex w-full flex-col items-start gap-10 md:flex-row md:items-start md:justify-between md:gap-12">
              {/* Left: Logo + copyright */}
              <div className="flex w-full flex-col items-start gap-2 md:w-auto md:pl-7">
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
              <div className="gap- grid w-full grid-cols-2 md:ml-auto md:w-auto md:grid-cols-3 md:gap-14 md:text-sm">
                {renderLinkSection("Developers", footerLinks.developers)}
                {renderLinkSection("Ressources", footerLinks.resources)}
                <div className="mb-5 md:mb-5">
                  {renderLinkSection("Company", footerLinks.company)}
                </div>
              </div>
            </div>
          </footer>
        </>
      )}
    </>
  );
}
