import { CategoryList } from "@/shared/components/ui/category-list";
import { ExternalLinks } from "@/shared/components/ui/external-link";
import { StatsList } from "@/shared/components/ui/stats-list";
import { TechStackList } from "@/shared/components/ui/tech-stack-list";

import { Profile } from "../types/profile.type";

interface ProfileSidebarProps {
  profile: Profile;
}

export default function ProfileSidebar({ profile }: ProfileSidebarProps) {
  const { userTechStacks = [], userCategories = [] } = profile;

  const stats = {
    starsEarned: profile.githubStats?.totalStars || 0,
    joinedProjects: profile.githubStats?.contributedRepos || 0,
    contributions: profile.contributionGraph?.totalContributions || 0,
  };

  const shouldShowStats = profile.provider !== "google";

  return (
    <div className="flex flex-1 flex-col gap-8">
      {shouldShowStats && (
        <StatsList
          title="Community Stats"
          items={[
            {
              icon: "star",
              label: "Earned stars",
              value: stats.starsEarned,
            },
            {
              icon: "fork",
              label: "Contributed repos",
              value: stats.joinedProjects,
            },
            {
              icon: "people",
              label: "Contributions this year",
              value: stats.contributions,
            },
          ]}
        />
      )}

      <TechStackList
        title="Technical Skills"
        techs={userTechStacks}
        emptyText="No skills added"
      />

      <CategoryList
        title="Interests"
        categories={userCategories}
        emptyText="No interests added"
      />

      <ExternalLinks
        title="Social Links"
        source={profile}
        emptyText="No links added"
      />
    </div>
  );
}
