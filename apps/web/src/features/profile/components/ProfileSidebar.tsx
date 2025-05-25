import { RightSidebar } from "@/components/shared/rightSidebar/RightSidebar";
import { RightSidebarLink } from "@/components/shared/rightSidebar/RightSidebarSection";

import { Profile } from "../types/profileTypes";

interface ProfileSidebarProps {
  profile: Profile;
}

export default function ProfileSidebar({ profile }: ProfileSidebarProps) {
  const socialLinks: RightSidebarLink[] =
    profile.socialLinks?.reduce<RightSidebarLink[]>((acc, social) => {
      switch (social.type) {
        case "linkedin":
          acc.push({
            icon: "/icons/linkedin.svg",
            label: social.url.split("/").pop() || social.url,
            url: social.url,
          });
          break;
        case "twitter":
          acc.push({
            icon: "/icons/x-logo.svg",
            label: `@${social.url.split("/").pop()}`,
            url: social.url,
          });
          break;
      }
      return acc;
    }, []) || [];

  const sections = [
    {
      title: "Socials",
      links: [
        {
          icon: "/icons/github.svg",
          label: `@${profile.login}`,
          url: profile.html_url,
        },
        ...socialLinks,
      ],
    },
    {
      title: "Stats OST",
      links: [
        {
          icon: "/icons/joined.svg",
          label: "Projets rejoins",
          value: profile.public_repos || 0,
        },
        {
          icon: "/icons/black-star.svg",
          label: "Stars",
          value:
            profile.projects?.reduce(
              (acc, project) => acc + (project.stargazers_count || 0),
              0
            ) || 0,
        },
        {
          icon: "/icons/created-projects-icon.svg",
          label: "Projets créés",
          value: profile.projects?.length || 0,
        },
      ],
    },
  ];

  return <RightSidebar sections={sections} />;
}
