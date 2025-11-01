"use client";

import { useMemo } from "react";
import { LiaBalanceScaleSolid } from "react-icons/lia";

import { CategoryList } from "@/shared/components/ui/category-list";
import { ExternalLinks } from "@/shared/components/ui/external-link";
import { StatsList } from "@/shared/components/ui/stats-list";
import { TechStackList } from "@/shared/components/ui/tech-stack-list";
import { languagesToTechStacks } from "@/shared/lib/language-icons";
import { formatNumberShort } from "@/shared/lib/utils/format-number";
import { formatTimeAgo } from "@/shared/lib/utils/format-time-ago";

import { ContributorsSidebarList } from "@/features/projects/components/contributors-sidebar-list.component";

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
      tags: [],
      languages: {},
      license: null,
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

  const languagesTechStacks = useMemo(() => {
    const converted = languagesToTechStacks(repositoryDetails?.languages || {});
    return converted;
  }, [repositoryDetails?.languages]);

  const allTechStacks = useMemo(() => {
    if (projectTechStacks.length > 0) {
      return projectTechStacks;
    }
    return languagesTechStacks;
  }, [projectTechStacks, languagesTechStacks]);

  const tagsCategories = useMemo(() => {
    return (
      repositoryDetails?.tags?.map((tag) => ({
        name: tag,
      })) || []
    );
  }, [repositoryDetails?.tags]);

  const allCategories = useMemo(() => {
    if (projectCategories.length > 0) {
      return projectCategories;
    }
    return tagsCategories;
  }, [projectCategories, tagsCategories]);

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
        techs={allTechStacks}
        emptyText="No technologies added"
      />

      <CategoryList
        title={projectCategories.length > 0 ? "Categories" : "Tags"}
        categories={allCategories}
        emptyText="No tags added"
        showTooltip={true}
      />

      <ContributorsSidebarList
        title="Contributors"
        contributors={allContributors}
        onClickContributor={handleContributorClick}
        emptyText="No contributors yet"
      />

      {repositoryDetails?.license && repositoryDetails?.license !== "Other" && (
        <div className="mb-2 flex flex-col">
          <h2 className="mb-3 text-sm">License</h2>
          <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
            <LiaBalanceScaleSolid className="size-5" />
            {repositoryDetails?.license}
          </p>
        </div>
      )}

      <ExternalLinks
        title="External Links"
        source={project}
        emptyText="No links added"
      />
    </div>
  );
}
