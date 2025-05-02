import React from 'react';
import Image from 'next/image';
import Button from '../ui/Button';
import githubWhite from '../icons/github-white.svg';

export default function Footer() {
  return (
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
  );
} 