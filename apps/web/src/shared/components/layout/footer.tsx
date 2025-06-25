import Link from "next/link";

import { Button } from "@/shared/components/ui/button";

import GithubLink from "../logos/github-link";
import TwitterLink from "../logos/twitter-link";

export default function Footer() {
  const navItems = ["Accueil", "Projets", "Blog"];

  return (
    <>
      <div className="flex h-[100px] w-full items-center justify-center bg-[#FAFAFA]">
        <div className="mx-auto flex w-full max-w-[1104px] items-center justify-between px-2">
          {/* Left */}
          <div className="flex items-center gap-2 text-sm tracking-tighter text-black/80">
            <span>©2025</span>
            <span className="font-medium">Open Source Together</span>
          </div>
          {/* Center */}
          <div className="flex items-center gap-4 text-black">
            {navItems.map((item) => (
              <Link
                href={`/${item.toLowerCase()}`}
                key={item}
                aria-label={`Navigate to ${item}`}
              >
                <Button variant="link" size="sm">
                  {item}
                </Button>
              </Link>
            ))}
          </div>
          {/* Right */}
          <div className="flex items-center gap-3">
            <TwitterLink url="https://x.com/OpenSTogether" />
            <GithubLink url="https://github.com/opensource-together" />
          </div>
        </div>
      </div>
    </>
  );
}
