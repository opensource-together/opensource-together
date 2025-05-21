import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import GithubLink from "../GithubLink";
import TwitterLink from "../TwitterLink";

export default function Footer() {
  const navItems = ["Accueil", "Projets", "Blog"];

  return (
    <>
      <div className="w-full max-w-[1104px] h-[306px] rounded-[20px] border border-[#000000]/10 mx-auto flex relative bg-white">
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
        <div className="absolute bottom-8 right-10 text-right">
          <h2 className="font-geist font-medium text-[32px] leading-[1.2] text-black">
            L'avenir du développement collaboratif.
            <br />
            Par la communauté, pour la communauté.
          </h2>
        </div>
      </div>
      {/* Ligne de détails sous le footer */}
      <div className="w-full max-w-[1104px] mx-auto flex items-center justify-between mt-40 px-2">
        {/* Left */}
        <div className="flex items-center gap-2 text-[14px] text-black/80 font-geist">
          <span>©2025</span>
          <span className="font-medium">Open Source Together</span>
        </div>
        {/* Center */}
        <div className="flex items-center gap-4 text-black font-geist">
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
