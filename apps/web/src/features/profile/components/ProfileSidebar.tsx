import { RightSidebar } from "@/components/shared/rightSidebar/RightSidebar";
import { RightSidebarLink } from "@/components/shared/rightSidebar/RightSidebarSection";

import { Profile } from "../types/profileTypes";

interface ProfileSidebarProps {
  profile: Profile;
}

export default function ProfileSidebar({ profile }: ProfileSidebarProps) {
  const {
    login,
    html_url,
    socialLinks: profileSocialLinks,
    public_repos,
    projects,
  } = profile;

  const socialLinks: RightSidebarLink[] =
    profileSocialLinks?.reduce<RightSidebarLink[]>((acc, social) => {
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
          label: `@${login}`,
          url: html_url,
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
          value: public_repos || 0,
        },
        {
          icon: "/icons/black-star.svg",
          label: "Stars",
          value:
            projects?.reduce(
              (acc, project) => acc + (project.stargazers_count || 0),
              0
            ) || 0,
        },
        {
          icon: "/icons/created-projects-icon.svg",
          label: "Projets créés",
          value: projects?.length || 0,
        },
      ],
    },
  ];

  return <RightSidebar sections={sections} />;
}
