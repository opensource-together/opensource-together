import Link from "next/link";

import StackLogo from "@/shared/components/logos/stack-logo";
import Icon, { IconName } from "@/shared/components/ui/icon";
import { Separator } from "@/shared/components/ui/separator";

import { Profile } from "../types/profile.type";

interface ProfileSidebarProps {
  profile: Profile;
}

const socialLinksConfig = [
  { key: "githubUrl", icon: "github", alt: "GitHub" },
  { key: "gitlabUrl", icon: "gitlab", alt: "GitLab" },
  { key: "twitterUrl", icon: "twitter", alt: "Twitter/X" },
  { key: "linkedinUrl", icon: "linkedin", alt: "LinkedIn" },
  { key: "discordUrl", icon: "discord", alt: "Discord" },
  { key: "websiteUrl", icon: "link", alt: "Website" },
] as const;

export default function ProfileSidebar({ profile }: ProfileSidebarProps) {
  const { userTechStacks = [] } = profile;

  const stats = {
    starsEarned: profile.githubStats?.totalStars || 0,
    joinedProjects: profile.githubStats?.contributedRepos || 0,
    contributions: profile.contributionGraph?.totalContributions || 0,
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
      {shouldShowStats && (
        <div className="mb-2 flex flex-col">
          <h2 className="mb-4 text-sm">Github Stats</h2>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Icon
                name="star"
                size="xs"
                variant="black"
                className="opacity-50"
              />
              <span className="text-sm font-normal text-neutral-500">
                Stars earned
              </span>
            </div>
            <div className="mx-4 flex flex-1 items-center">
              <Separator />
            </div>
            <span className="text-primary text-sm font-medium">
              {stats.starsEarned}
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Icon
                name="fork"
                size="xs"
                variant="black"
                className="opacity-50"
              />
              <span className="text-sm font-normal text-neutral-500">
                Contributed repos
              </span>
            </div>
            <div className="mx-4 flex flex-1 items-center">
              <Separator />
            </div>
            <span className="text-primary text-sm font-medium">
              {stats.joinedProjects}
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Icon
                name="people"
                size="xs"
                variant="black"
                className="opacity-50"
              />
              <span className="text-sm font-normal text-neutral-500">
                Contributions this year
              </span>
            </div>
            <div className="mx-4 flex flex-1 items-center">
              <Separator />
            </div>
            <span className="text-primary text-sm font-medium">
              {stats.contributions}
            </span>
          </div>
        </div>
      )}

      <div className="mb-2 flex flex-col">
        <h2 className="mb-4 text-sm">Technologies</h2>
        {userTechStacks.length > 0 ? (
          <div className="flex w-full flex-wrap gap-2.5 gap-y-2">
            {userTechStacks.map((tech, index) => (
              <StackLogo
                key={tech.id || index}
                name={tech.name}
                icon={tech.iconUrl}
                alt={tech.name}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-black/50">No skills added</p>
        )}
      </div>

      <div className="mb-2 flex flex-col">
        <h2 className="mb-4 text-sm">External links</h2>
        {(() => {
          const hasAnyLink = socialLinksConfig.some(({ key }) => {
            const v = profile[key] as string | undefined;
            return Boolean(v && v.trim().length > 0);
          });

          if (!hasAnyLink) {
            return (
              <p className="text-muted-foreground text-sm">No links added</p>
            );
          }

          return (
            <div className="flex flex-col gap-6">
              {socialLinksConfig.map(({ key, icon, alt }) => {
                const url = profile[key] as string | undefined;
                if (!url) return null;

                return (
                  <Link
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-black"
                  >
                    <Icon
                      name={icon as IconName}
                      size="sm"
                      variant="gray"
                      alt={alt}
                      className="opacity-50 transition-opacity group-hover:opacity-100"
                    />
                    <span className="truncate">{formatUrl(url)}</span>
                  </Link>
                );
              })}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
