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

  return (
    <>
      {!hideFooter && (
        <>
          <footer className="mx-4 max-w-7xl pt-0 pb-3 md:mx-auto md:px-0 md:pb-5">
            <Separator className="mx-auto mb-5 w-11/12 md:mb-8 lg:mb-8 lg:w-full" />
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
                <span className="text-xs text-neutral-500 md:text-sm">
                  © OpenSource Together • 2025
                </span>
              </div>

              {/* Right: Link sections */}
              <div className="grid w-full grid-cols-2 gap-12 text-xs md:ml-auto md:w-auto md:grid-cols-3 md:gap-20 md:text-sm">
                <div>
                  <h4 className="mb-5 font-medium text-neutral-900 md:mb-6">
                    Developers
                  </h4>
                  <ul className="space-y-5 text-neutral-500 md:space-y-6">
                    <li>
                      <Link
                        className="transition hover:text-neutral-700"
                        href="#"
                      >
                        Documentation
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="transition hover:text-neutral-700"
                        href="https://github.com/opensource-together/opensource-together"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Github
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-5 font-medium text-neutral-900 md:mb-6">
                    Ressources
                  </h4>
                  <ul className="space-y-5 text-neutral-500 md:space-y-6">
                    <li>
                      <Link
                        className="transition hover:text-neutral-700"
                        href="#"
                      >
                        Changelog
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="transition hover:text-neutral-700"
                        href="#"
                      >
                        Press Kit
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="transition hover:text-neutral-700"
                        href="#"
                      >
                        Blog
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="mb-5 md:mb-5">
                  <h4 className="mb-5 font-medium text-neutral-900 md:mb-6">
                    Company
                  </h4>
                  <ul className="space-y-5 text-neutral-500 md:space-y-6">
                    <li>
                      <Link
                        className="transition hover:text-neutral-700"
                        href="#"
                      >
                        Contact
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="transition hover:text-neutral-700"
                        href="https://x.com/OpenSTogether"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        X (Twitter)
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="transition hover:text-neutral-700"
                        href="#"
                      >
                        Legal
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}
    </>
  );
}
