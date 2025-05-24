import GithubLink from "../GithubLink";
import TwitterLink from "../TwitterLink";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const navItems = ["Accueil", "Projets", "Blog"];

  return (
    <>
      <div className="relative mx-auto flex h-[306px] w-full max-w-[1104px] rounded-3xl border border-[#000000]/10 bg-white">
        {/* Bouton en bas à gauche avec marge */}
        <div className="absolute bottom-8 left-10">
          <Link
            href="https://github.com/opensource-together/opensource-together"
            target="_blank"
            aria-label="Star our GitHub"
          >
            <Button className="flex items-center gap-2">
              Star notre GitHub
              <Image
                src="/icons/github-white.svg"
                alt="GitHub"
                width={18}
                height={18}
              />
            </Button>
          </Link>
        </div>
        {/* Texte en bas à droite avec marge */}
        <div className="absolute right-10 bottom-8 text-right">
          <h2 className="text-3xl font-medium text-black">
            L'avenir du développement collaboratif.
            <br />
            Par la communauté, pour la communauté.
          </h2>
        </div>
      </div>
      {/* Ligne de détails sous le footer */}
      <div className="mx-auto mt-40 flex w-full max-w-[1104px] items-center justify-between px-2">
        {/* Left */}
        <div className="flex items-center gap-2 text-sm text-black/80">
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
          <GithubLink url="https://github.com/opensource-together/opensource-together" />
          <TwitterLink url="https://x.com/OpenSTogether" />
        </div>
      </div>
    </>
  );
}
