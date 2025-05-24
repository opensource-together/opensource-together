import { RightSidebar } from "@/components/shared/rightSidebar/RightSidebar";
import { CommunityStats, SocialLink } from "../types/projectTypes";

interface ProjectSideBarProps {
  socialLinks?: SocialLink[];
  communityStats?: CommunityStats;
}

export default function ProjectSideBar({
  socialLinks = [],
  communityStats,
}: ProjectSideBarProps) {
  const sections = [
    {
      title: "Partager",
      links: [
        {
          icon: "/icons/linkedin.svg",
          label: "Partager sur Linkedin",
          url: "https://linkedin.com/share",
        },
        {
          icon: "/icons/x-logo.svg",
          label: "Partager sur X",
          url: "https://x.com/share",
        },
        ...socialLinks
          .filter((link) => link.type === "github")
          .map((link) => ({
            icon: "/icons/github.svg",
            label: "Voir sur GitHub",
            url: link.url,
          })),
      ],
    },
    {
      title: "Statistiques du projet",
      links: [
        {
          icon: "/icons/black-star.svg",
          label: "Stars",
          value: communityStats?.stars || 0,
        },
        {
          icon: "/icons/two-people.svg",
          label: "Membres",
          value: communityStats?.contributors || 0,
        },
        {
          icon: "/icons/github.svg",
          label: "Forks",
          value: communityStats?.forks || 0,
        },
      ],
    },
  ];

  return <RightSidebar sections={sections} />;
}

export function SkeletonProjectSideBar() {
  return (
    <div className="flex w-[270px] animate-pulse flex-col gap-10">
      <div>
        <div className="mb-3 h-5 w-24 rounded bg-gray-200" />
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="h-[15px] w-[15px] rounded bg-gray-200" />
            <div className="h-4 w-32 rounded bg-gray-100" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-[15px] w-[15px] rounded bg-gray-200" />
            <div className="h-4 w-28 rounded bg-gray-100" />
          </div>
        </div>
      </div>
      <div>
        <div className="mb-3 h-5 w-32 rounded bg-gray-200" />
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="h-[14px] w-[15px] rounded bg-gray-200" />
            <div className="h-4 w-20 rounded bg-gray-100" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-[15px] w-[13px] rounded bg-gray-200" />
            <div className="h-4 w-24 rounded bg-gray-100" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-[15px] w-[15px] rounded bg-gray-200" />
            <div className="h-4 w-20 rounded bg-gray-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
