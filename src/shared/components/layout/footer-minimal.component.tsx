import Image from "next/image";
import Link from "next/link";

import { Separator } from "@/shared/components/ui/separator";

export default function FooterMinimal() {
  const navigationLinks = [
    { name: "Guide", href: "/oss-guide" },
    { name: "X (Twitter)", href: "https://x.com/OpenSTogether" },
    { name: "Discord", href: "https://discord.gg/4ZDhm3dQAC" },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/opensource-together",
    },
  ];

  return (
    <footer className="relative z-20 hidden w-full bg-white md:block">
      <Separator className="w-full" />
      <div className="flex w-full flex-col items-center gap-3 pt-4 pb-4 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="flex w-full items-center justify-center gap-4 md:w-auto md:justify-start md:gap-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/ost-logo.svg"
              alt="ost-logo"
              width={39}
              height={39}
              className="h-auto max-h-[39px] w-auto"
            />
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-4 text-xs md:justify-start md:gap-6 md:text-sm">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-muted-foreground tracking-tight transition hover:text-foreground"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 text-xs md:text-sm">
          <span className="text-muted-foreground">
            © OpenSource Together • 2025
          </span>
        </div>
      </div>
    </footer>
  );
}
