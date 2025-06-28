import Image from "next/image";
import Link from "next/link";

import GithubLink from "../logos/github-link";
import LinkedinLink from "../logos/linkedin-link";
import TwitterLink from "../logos/twitter-link";

export default function Footer() {
  const navigationLinks = [
    { name: "Services", href: "/services" },
    { name: "Benefits", href: "/benefits" },
    { name: "How it works", href: "/how-it-works" },
    { name: "FAQ", href: "/faq" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of service", href: "/terms" },
  ];

  return (
    <footer className="mx-4 rounded-t-4xl bg-neutral-50 tracking-tighter md:mx-14">
      {/* Main Footer Content */}
      <div className="mx-auto p-8 md:p-12 md:pr-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between lg:gap-0">
          <div className="space-y-4 lg:col-span-1">
            <div className="space-y-3">
              <Image
                src="/ost-logo.svg"
                alt="OpenSource Together"
                width={190}
                height={40}
                className="w-40 md:w-auto"
              />
              <p className="mt-4 text-sm md:mt-5 md:text-base">
                Trouvez des projets, postulez à des rôles, collaborez,
                construisons, <br className="hidden md:block" /> partageons et
                grandissons ensemble grâce à l'open source.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3 md:mt-8">
              <TwitterLink url="https://x.com/OpenSTogether" />
              <GithubLink url="https://github.com/opensource-together" />
              <LinkedinLink url="https://www.linkedin.com/company/opensource-together" />
            </div>
          </div>

          {/* Footer links */}
          <div className="flex gap-8 sm:gap-20">
            <div className="space-y-4">
              <h3 className="font-medium">Navigation</h3>
              <ul className="space-y-3">
                {navigationLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-black/70 transition-colors duration-200 hover:text-black"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Legal mentions</h3>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-black/70 transition-colors duration-200 hover:text-black"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
