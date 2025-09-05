import Link from "next/link";

import StackLogo from "@/shared/components/logos/stack-logo";
import BreadcrumbNavigation from "@/shared/components/ui/breadcrumb-navigation";
import Icon, { IconName } from "@/shared/components/ui/icon";
import { Separator } from "@/shared/components/ui/separator";

import { Profile } from "../types/profile.type";

interface ProfileSidebarProps {
  profile: Profile;
}

const socialLinksConfig = [
  { key: "github", icon: "github", alt: "GitHub" },
  { key: "twitter", icon: "twitter", alt: "Twitter/X" },
  { key: "linkedin", icon: "linkedin", alt: "LinkedIn" },
  { key: "discord", icon: "discord", alt: "Discord" },
  { key: "website", icon: "link", alt: "Website" },
];

export default function ProfileSidebar({ profile }: ProfileSidebarProps) {
  const { techStacks = [], socialLinks = {} } = profile;
  const breadcrumbItems = [
    {
      label: "Découvrir",
      href: "/",
      isActive: false,
    },
    {
      label: profile.username || "Profile",
      isActive: true,
    },
  ];

  const stats = {
    starsEarned: profile.githubStats?.totalStars || 0,
    joinedProjects: profile.githubStats?.contributedRepos || 0,
    contributions: profile.githubStats?.commitsThisYear || 0,
  };

  const shouldShowStats = profile.provider !== "google";

  const formatUrl = (url: string) => {
    if (!url) return "";
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname;
    } catch {
      return url;
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-5">
      <BreadcrumbNavigation items={breadcrumbItems} className="mb-3" />

      {shouldShowStats && (
        <div className="mb-2 flex flex-col">
          <h2 className="text-md mb-1">Statistiques GitHub</h2>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Icon name="star" size="sm" variant="black" />
              <span className="text-sm font-normal text-black">
                Stars gagnées
              </span>
            </div>
            <div className="mx-4 flex flex-1 items-center">
              <Separator />
            </div>
            <span className="text-sm font-medium text-black">
              {stats.starsEarned}
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Icon name="fork" size="sm" variant="black" />
              <span className="text-sm font-normal text-black">
                Repos contribués
              </span>
            </div>
            <div className="mx-4 flex flex-1 items-center">
              <Separator />
            </div>
            <span className="text-sm font-medium text-black">
              {stats.joinedProjects}
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Icon name="people" size="sm" variant="black" />
              <span className="text-sm font-normal text-black">
                Commits cette année
              </span>
            </div>
            <div className="mx-4 flex flex-1 items-center">
              <Separator />
            </div>
            <span className="text-sm font-medium text-black">
              {stats.contributions}
            </span>
          </div>
        </div>
      )}

      <div className="mb-2 flex flex-col">
        <h2 className="text-md mb-2">Technologies</h2>
        {techStacks.length > 0 ? (
          <div className="flex w-full flex-wrap gap-x-5 gap-y-2">
            {techStacks.map((tech, index) => (
              <StackLogo
                key={tech.id || index}
                name={tech.name}
                icon={tech.iconUrl}
                alt={tech.name}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-black/50">Aucune compétence renseignée</p>
        )}
      </div>

      <div className="mb-2 flex flex-col">
        <h2 className="text-md mb-4">Liens externes</h2>
        <div className="flex flex-col gap-6">
          {socialLinksConfig.map((config) => {
            const url = socialLinks[config.key as keyof typeof socialLinks];
            if (!url) return null;

            return (
              <Link
                key={config.key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group text-muted-foreground flex items-center gap-2 text-sm transition-colors hover:text-black"
              >
                <Icon
                  name={config.icon as IconName}
                  size="md"
                  variant="gray"
                  alt={config.alt}
                  className="opacity-50 transition-opacity group-hover:opacity-100"
                />
                <span className="truncate">{formatUrl(url)}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
