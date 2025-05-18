import Image from "next/image";
import starIcon from "../../../shared/icons/blackstaricon.svg";
import createdIcon from "../../../shared/icons/createdprojectsicon.svg";
import githubIcon from "../../../shared/icons/githubgrisicon.svg";
import linkedinIcon from "../../../shared/icons/linkedingrisicon.svg";
import twitterIcon from "../../../shared/icons/twitterxgrisicon.svg";
import { CommunityStats, SocialLink } from "../types/projectTypes";

interface ProjectSideBarProps {
  socialLinks?: SocialLink[];
  communityStats?: CommunityStats;
  showForks?: boolean;
}

export default function ProjectSideBar({
  socialLinks = [],
  communityStats,
  showForks = true,
}: ProjectSideBarProps) {
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
          {socialLinks.map((link, index) => {
            if (link.type === "github") {
              return (
                <div key={index} className="flex items-center gap-3">
                  <Image src={githubIcon} alt="GitHub" width={15} height={15} />
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] text-black/70 hover:underline"
                  >
                    View on GitHub
                  </a>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* Community Stats Section */}
      <div>
        <h2 className="text-[18px] font-medium mb-3">Community Stats</h2>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <Image src={starIcon} alt="Stars" width={15} height={14} />
            <span className="text-[14px] text-black/70">
              {communityStats?.stars || 0} Stars
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Image src={createdIcon} alt="Members" width={13} height={15} />
            <span className="text-[14px] text-black/70">
              {communityStats?.contributors || 0} Members
            </span>
          </div>
          {showForks && (
            <div className="flex items-center gap-3">
              <Image src={githubIcon} alt="Forks" width={15} height={15} />
              <span className="text-[14px] text-black/70">
                {communityStats?.forks || 0} Forks
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SkeletonProjectSideBar() {
  return (
    <div className="w-[270px] flex flex-col gap-10 animate-pulse">
      <div>
        <div className="h-5 w-24 bg-gray-200 rounded mb-3" />
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-[15px] h-[15px] bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-100 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-[15px] h-[15px] bg-gray-200 rounded" />
            <div className="h-4 w-28 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
      <div>
        <div className="h-5 w-32 bg-gray-200 rounded mb-3" />
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-[15px] h-[14px] bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-100 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-[13px] h-[15px] bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-100 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-[15px] h-[15px] bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
