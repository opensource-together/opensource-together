import React from 'react';
import Image from 'next/image';
import githubIcon from '../../../shared/icons/githubgrisicon.svg';
import linkedinIcon from '../../../shared/icons/linkedingrisicon.svg';
import twitterIcon from '../../../shared/icons/twitterxgrisicon.svg';
import joinedIcon from '../../../shared/icons/joinedicon.svg';
import starIcon from '../../../shared/icons/blackstaricon.svg';
import createdIcon from '../../../shared/icons/createdprojectsicon.svg';

export default function ProfileSidebar() {
  return (
    <div className="w-[270px] font-geist flex flex-col gap-10 ">
      {/* Socials Section */}
      <div>
        <h2 className="text-[18px] font-medium mb-3">Socials</h2>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <Image src={githubIcon} alt="GitHub" width={15} height={19} />
            <span className="text-[14px] text-[#000000]/70">@zinedine4567</span>
          </div>
          <div className="flex items-center gap-3">
            <Image src={linkedinIcon} alt="LinkedIn" width={15} height={15} />
            <span className="text-[14px] text-[#000000]/70">@zinedine4567</span>
          </div>
          <div className="flex items-center gap-3">
            <Image src={twitterIcon} alt="X/Twitter" width={15} height={15} />
            <span className="text-[14px] text-[#000000]/70">@zinedine4567</span>
          </div>
        </div>
      </div>

      {/* Community Stats Section */}
      <div>
        <h2 className="text-[18px] font-medium mb-3">Community Stats</h2>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <Image src={joinedIcon} alt="Joined Projects" width={15} height={13} />
            <span className="text-[12px] text-[#000000]/70">Joined Projects <span className="text-[14px] text-black font-medium">5</span></span>
          </div>
          <div className="flex items-center gap-3">
            <Image src={starIcon} alt="Stars" width={15} height={14} />
            <span className="text-[14px] text-[#000000]/70">Stars <span className="text-[14px] text-black font-medium">127</span></span>
            
          </div>
          <div className="flex items-center gap-3">
            <Image src={createdIcon} alt="Created Projects" width={13} height={15} />
            <span className="text-[14px] text-[#000000]/70">Created Projects <span className="text-[14px] text-black font-medium">3</span></span>
          </div>
        </div>
      </div>
    </div>
  );
} 