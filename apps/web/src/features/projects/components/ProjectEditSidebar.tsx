import { RightSidebar } from "@/components/shared/rightSidebar/RightSidebar";

import { Project } from "../types/projectTypes";

interface ProjectEditSidebarProps {
  project: Project;
}

export default function ProjectEditSidebar({
  project,
}: ProjectEditSidebarProps) {
  const {
    socialLinks = [],
    communityStats: { contributors = 0, stars = 0, forks = 0 } = {},
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
