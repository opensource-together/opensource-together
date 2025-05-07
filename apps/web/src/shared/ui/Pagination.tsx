import React from 'react';
import Image from 'next/image';
import leftChevron from '@/shared/icons/chevron-left-small.svg';
import rightChevron from '@/shared/icons/chevron-right-small.svg';

export default function Pagination() {
  return (
    <div className="flex items-center justify-center gap-3">
      <button className="flex items-center gap-1 px-2 py-1 font-geist font-semibold text-[14px] text-[black]">
        <Image src={leftChevron} alt="Previous" width={5} height={10} />
        <span>Previous</span>
      </button>
      
      <div className="flex items-center gap-2">
        <button className="h-[30px] min-w-[30px] px-2 font-geist font-semibold text-[14px] flex items-center justify-center">
          1
        </button>
        
        <button className="h-[30px] min-w-[30px] px-2 font-geist font-semibold text-[14px] flex items-center justify-center border border-[black]/10 rounded-[4px]">
          2
        </button>
        
        <button className="h-[30px] min-w-[30px] px-2 font-geist font-semibold text-[14px] flex items-center justify-center">
          3
        </button>
        
        <span className="mx-1 font-geist">...</span>
      </div>
      
      <button className="flex items-center gap-1 px-2 py-1 font-geist font-semibold text-[14px] text-[black]">
        <span>Next</span>
        <Image src={rightChevron} alt="Next" width={5} height={10} />
      </button>
    </div>
  );
};
