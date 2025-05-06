import React from 'react';
import Image from 'next/image';
import billboardImage from '../icons/billboard.svg';

export default function Billboard() {
  return (
    <div className="font-geist flex justify-center w-full">
      <div className="max-w-[1200px] w-full flex flex-col lg:flex-row justify-between items-center">
        <div className="flex flex-col max-w-[650px] items-center lg:items-start px-4 lg:px-0">
          <h1 className="text-[40px] lg:text-[45px] font-geist font-medium text-center lg:text-left leading-tight lg:leading-tight">
            <span className="inline-block leading-tight lg:leading-tight">Collaborez avec les</span> <span className="inline-block text-[#0354EC] font-semibold leading-tight lg:leading-tight">Meilleurs</span> <span className="inline-block leading-tight lg:leading-tight">sur l&apos;open source</span>
          </h1>
          <p className="font-geist text-[16px] text-slate-500 md:text-[17px] lg:text-[18px] text-center lg:text-left mt-5 leading-normal max-w-[520px]">
            Rejoignez notre communauté pour créer, contribuer et grandir. Trouvez des projets open source qui correspondent à vos compétences et intérêts.
          </p>
        </div>

        <div className="mt-10 lg:mt-0">
          <Image src={billboardImage} width={517} height={331} alt="Billboard image" className="max-w-full h-auto" />
        </div>
      </div>
    </div>
  );
}
