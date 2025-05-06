import React from 'react';
import Image from 'next/image';
import arrowLeft from '../icons/arrow-left.svg';
import arrowRight from '../icons/arrow-right.svg';

export default function Pagination() {
  return (
    <div className="font-geist flex justify-center items-center gap-4 md:gap-5 w-full mt-8 md:mt-10">
      <div className="w-[25px] h-[25px] md:w-[30px] md:h-[30px] flex items-center justify-center border border-[black]/10 rounded-[5px] cursor-pointer">
        <Image src={arrowLeft} alt="arrowLeft" width={9} height={9} />
      </div>
      
      <div className="flex gap-1 md:gap-2">
        <div className="w-[25px] h-[25px] md:w-[30px] md:h-[30px] flex items-center justify-center bg-[#0354EC] rounded-[5px] text-white text-[12px] cursor-pointer">1</div>
        <div className="w-[25px] h-[25px] md:w-[30px] md:h-[30px] flex items-center justify-center border border-[black]/10 rounded-[5px] text-[12px] cursor-pointer hover:bg-[#F5F5F5]">2</div>
        <div className="w-[25px] h-[25px] md:w-[30px] md:h-[30px] flex items-center justify-center border border-[black]/10 rounded-[5px] text-[12px] cursor-pointer hover:bg-[#F5F5F5]">3</div>
        <div className="w-[25px] h-[25px] md:w-[30px] md:h-[30px] flex items-center justify-center text-[12px]">...</div>
        <div className="w-[25px] h-[25px] md:w-[30px] md:h-[30px] flex items-center justify-center border border-[black]/10 rounded-[5px] text-[12px] cursor-pointer hover:bg-[#F5F5F5]">12</div>
      </div>
      
      <div className="w-[25px] h-[25px] md:w-[30px] md:h-[30px] flex items-center justify-center border border-[black]/10 rounded-[5px] cursor-pointer">
        <Image src={arrowRight} alt="arrowRight" width={9} height={9} />
      </div>
    </div>
  );
} 