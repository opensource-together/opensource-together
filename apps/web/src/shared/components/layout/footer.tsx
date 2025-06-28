import Image from "next/image";
import Link from "next/link";

import GithubLink from "../logos/github-link";
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
    <footer className="mx-14 rounded-t-4xl bg-neutral-50 tracking-tighter">
      {/* Main Footer Content */}
      <div className="mx-auto p-12 pr-20">
        <div className="flex justify-between">
          <div className="space-y-4 lg:col-span-1">
            <div className="space-y-3">
              <Image
                src="/ost-logo.svg"
                alt="OpenSource Together"
                width={190}
                height={40}
              />
              <p className="mt-8">
                Trouvez des projets, postulez à des rôles, collaborez,
                construisons, <br /> partageons et grandissons ensemble grâce à
                l'open source
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <TwitterLink url="https://x.com/OpenSTogether" />
              <GithubLink url="https://github.com/opensource-together" />
            </div>
          </div>

          {/* Footer links */}
          <div className="mt-3 flex gap-20">
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
