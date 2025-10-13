import StackLogo from "@/shared/components/logos/stack-logo";
import { ExternalLinks } from "@/shared/components/ui/external-link";
import Icon from "@/shared/components/ui/icon";
import { Separator } from "@/shared/components/ui/separator";

import { Profile } from "../types/profile.type";

interface ProfileSidebarProps {
  profile: Profile;
}

export default function ProfileSidebar({ profile }: ProfileSidebarProps) {
  const { userTechStacks = [] } = profile;

  const stats = {
    starsEarned: profile.githubStats?.totalStars || 0,
    joinedProjects: profile.githubStats?.contributedRepos || 0,
    contributions: profile.contributionGraph?.totalContributions || 0,
  };

  const shouldShowStats = profile.provider !== "google";

  return (
    <div className="flex flex-1 flex-col gap-5">
      {shouldShowStats && (
        <div className="mb-2 flex flex-col">
          <h2 className="mb-4 text-sm">Community Stats</h2>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Icon
                name="star"
                size="xs"
                variant="black"
                className="opacity-50"
              />
              <span className="text-sm font-normal text-neutral-500">
                Earned stars
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
        <h2 className="mb-4 text-sm">Technical Skills</h2>
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
        <h2 className="mb-4 text-sm">Social Links</h2>
        <ExternalLinks source={profile} />
      </div>
    </div>
  );
}
