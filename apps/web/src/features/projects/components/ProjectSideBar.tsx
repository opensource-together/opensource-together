import { RightSidebar } from "@/components/shared/rightSidebar/RightSidebar";
import { Skeleton } from "@/components/ui/skeleton";

import { Project } from "../types/projectTypes";

interface ProjectSideBarProps {
  project: Project;
}

export default function ProjectSideBar({ project }: ProjectSideBarProps) {
  const {
    socialLinks = [],
    communityStats: { stars = 0, contributors = 0, forks = 0 } = {},
  } = project;

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
          value: stars,
        },
        {
          icon: "/icons/two-people.svg",
          label: "Membres",
          value: contributors,
        },
        {
          icon: "/icons/github.svg",
          label: "Forks",
          value: forks,
        },
      ],
    },
  ];

  return <RightSidebar sections={sections} />;
}

export function SkeletonProjectSideBar() {
  return (
    <div className="flex w-[270px] flex-col gap-10">
      <div>
        <Skeleton className="mb-3 h-5 w-24" />
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-[15px] w-[15px]" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-[15px] w-[15px]" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </div>
      <div>
        <Skeleton className="mb-3 h-5 w-32" />
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-[14px] w-[15px]" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-[15px] w-[13px]" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-[15px] w-[15px]" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
