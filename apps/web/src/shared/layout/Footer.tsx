import Image from "next/image";
import githubWhite from "../icons/github-white.svg";
import githubIcon from "../icons/github.svg";
import xlogo from "../icons/x.svg";
import Button from "../ui/Button";

export default function Footer() {
  return (
    <>
      <div className="w-full max-w-[1104px] h-[306px] rounded-[20px] border border-[#000000]/10 mx-auto flex relative bg-white">
        {/* Bouton en bas à gauche avec marge */}
        <div className="absolute bottom-8 left-10">
          <Button className="flex items-center gap-2">
            Star our GitHub
            <Image src={githubWhite} alt="GitHub" width={18} height={18} />
          </Button>
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
        <div className="flex items-center gap-8 text-[13px] text-black font-geist">
          <a href="#" className="hover:underline">
            Home
          </a>
          <a href="#" className="hover:underline">
            Profile
          </a>
          <a href="#" className="hover:underline">
            Marketing Website
          </a>
        </div>
        {/* Right */}
        <div className="flex items-center gap-3">
          <a href="#" aria-label="GitHub">
            <Image src={githubIcon} alt="GitHub" width={17} height={18} />
          </a>
          <a href="#" aria-label="X">
            <Image
              src={xlogo}
              alt="X"
              width={16}
              height={17}
              style={{ filter: "brightness(0) saturate(100%)" }}
            />
          </a>
        </div>
      </div>
    </>
  );
}
