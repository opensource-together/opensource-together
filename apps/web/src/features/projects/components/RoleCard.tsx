import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import arrowupright from '@/shared/icons/arrow-up-right.svg';


interface Badge {
  label: string;
  color: string;
  bgColor: string;
}

interface RoleCardProps {
  title: string;
  description: string;
  badges?: Badge[];
  buttonLabel?: string;
  buttonHref?: string;
}

const RoleCard: React.FC<RoleCardProps> = ({
  title,
  description,
  badges = [],
  buttonLabel = 'Apply for role',
  buttonHref = '#',
}) => (
  <div className="w-[717px] h-[183px] bg-white rounded-[16px] border border-black/10 shadow-[0_0_0.5px_0_rgba(0,0,0,0.20)] px-8 py-6 flex flex-col justify-between mb-6">
    <h3 className="font-geist font-medium text-[15px] text-black mb-2">{title}</h3>
    <p className="font-geist font-normal text-[12px] leading-[20px] text-black/70 mb-4">{description}</p>
    <div className="border-t border-dashed border-black/10 w-full mb-3"></div>
    <div className="flex items-end justify-between mt-auto">
      <div className="flex gap-2">
        {badges.length > 0 && badges.map((badge, idx) => (
          <span
            key={idx}
            className="px-3 py-[2px] rounded-[3px] text-[11px] font-geist font-medium"
            style={{ color: badge.color, backgroundColor: badge.bgColor }}
          >
            {badge.label}
          </span>
        ))}
      </div>
      <Link href="/role" className="text-[14px] font-semibold ml-auto flex font-geist  items-center gap-1 hover:opacity-80 transition-opacity">
        Apply For Role <Image src={arrowupright} alt="arrowupright" width={10} height={10} />
      </Link>
    </div>
  </div>
);

export default RoleCard;

export function SkeletonRoleCard() {
  return (
    <div className="w-[717px] h-[183px] bg-white rounded-[16px] border border-black/10 shadow-[0_0_0.5px_0_rgba(0,0,0,0.20)] px-8 py-6 flex flex-col justify-between mb-6 animate-pulse">
      <div className="h-5 w-40 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-3/4 bg-gray-100 rounded mb-4" />
      <div className="border-t border-dashed border-black/10 w-full mb-3"></div>
      <div className="flex items-end justify-between mt-auto">
        <div className="flex gap-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="w-[60px] h-[24px] bg-gray-100 rounded" />
          ))}
        </div>
        <div className="h-8 w-32 bg-gray-200 rounded ml-auto" />
      </div>
    </div>
  );
}
