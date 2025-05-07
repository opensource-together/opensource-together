import React from 'react';
import Image from 'next/image';
import githubIcon from '../../../shared/icons/githubgrisicon.svg';
import linkedinIcon from '../../../shared/icons/linkedingrisicon.svg';
import twitterIcon from '../../../shared/icons/twitterxgrisicon.svg';
import joinedIcon from '../../../shared/icons/joinedicon.svg';
import starIcon from '../../../shared/icons/blackstaricon.svg';
import createdIcon from '../../../shared/icons/createdprojectsicon.svg';

export default function ProjectSideBar() {
  return (
    <div className="w-[270px] font-geist flex flex-col gap-10 ">
      {/* Share Section */}
      <div>
        <h2 className="text-[18px] font-medium mb-3">Share</h2>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <Image src={linkedinIcon} alt="LinkedIn" width={15} height={15} />
            <span className="text-[14px] text-black/70">Share on Linkedin</span>
          </div>
          <div className="flex items-center gap-3">
            <Image src={twitterIcon} alt="X" width={15} height={15} />
            <span className="text-[14px] text-black/70">Share on X</span>
          </div>
        </div>
      </div>

      {/* Community Stats Section */}
      <div>
        <h2 className="text-[18px] font-medium mb-3">Community Stats</h2>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <Image src={starIcon} alt="Stars" width={15} height={14} />
            <span className="text-[14px] text-black/70">Stars</span>
          </div>
          <div className="flex items-center gap-3">
            <Image src={createdIcon} alt="Members" width={13} height={15} />
            <span className="text-[14px] text-black/70">Members</span>
          </div>
        </div>
      </div>
    </div>
  );
} 