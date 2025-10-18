import { CategoryList } from "@/shared/components/ui/category-list";
import { ExternalLinks } from "@/shared/components/ui/external-link";
import { StatsList } from "@/shared/components/ui/stats-list";
import { TechStackList } from "@/shared/components/ui/tech-stack-list";
import { formatNumberShort } from "@/shared/lib/utils/format-number";
import { formatTimeAgo } from "@/shared/lib/utils/format-time-ago";

import { ContributorsSidebarList } from "@/features/projects/components/contributors-sidebar-list";

import { Project } from "../types/project.type";

interface ProjectSideBarProps {
  project: Project;
}

export default function ProjectSideBar({ project }: ProjectSideBarProps) {
  const {
    projectTechStacks = [],
    projectCategories = [],
    repositoryDetails = {
      stars: null,
      forksCount: null,
      contributors: [],
      pushed_at: null,
    },
  } = project;

  const contributors = project.repositoryDetails?.contributors || [];

  const allContributors = (() => {
    if (!contributors || contributors.length === 0) return [];
    return contributors;
  })();

  const handleContributorClick = (contributor: { login?: string }) => {
    if (contributor.login) {
      const url = `https://github.com/${contributor.login}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-8">
      <StatsList
        title="Statistics"
        items={[
          {
            icon: "star",
            label: "Stars",
            value: formatNumberShort(repositoryDetails?.stars ?? 0),
          },
          {
            icon: "fork",
            label: "Forks",
            value: formatNumberShort(repositoryDetails?.forksCount ?? 0),
          },
          {
            icon: "people",
            label: "Contributors",
            value: allContributors.length > 99 ? "99+" : allContributors.length,
          },
          {
            icon: "last-commit",
            label: "Last Commit",
            value: repositoryDetails?.pushed_at
              ? formatTimeAgo(repositoryDetails?.pushed_at)
              : "N/A",
          },
        ]}
      />

      <TechStackList
        title="Technical Stack"
        techs={projectTechStacks}
        emptyText="No technologies added"
      />

      <CategoryList
        title="Category Tags"
        categories={projectCategories}
        emptyText="No categories added"
      />

      <ContributorsSidebarList
        title="Contributors"
        contributors={allContributors}
        onClickContributor={handleContributorClick}
        emptyText="No contributors yet"
      />

      <ExternalLinks
        title="External Links"
        source={project}
        emptyText="No links added"
      />
    </div>
  );
}
