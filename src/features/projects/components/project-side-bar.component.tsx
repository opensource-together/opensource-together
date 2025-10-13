import StackLogo from "@/shared/components/logos/stack-logo";
import { Avatar } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { ExternalLinks } from "@/shared/components/ui/external-link";
import { Icon } from "@/shared/components/ui/icon";
import { Separator } from "@/shared/components/ui/separator";
import useProfileNavigation from "@/shared/hooks/use-profile-navigation.hook";

import { Contributor, Project } from "../types/project.type";

interface ProjectSideBarProps {
  project: Project;
}

export default function ProjectSideBar({ project }: ProjectSideBarProps) {
  const { navigateToProfile } = useProfileNavigation();
  const {
    projectTechStacks = [],
    projectCategories = [],
    projectStats = {
      stars: 0,
      forks: 0,
      contributors: [],
      lastCommit: {
        date: "",
        message: "",
        sha: "",
        url: "",
        author: { login: "", avatar_url: "", html_url: "" },
      },
    },
  } = project;

  const contributors = project.projectStats?.contributors || [];

  const allContributors = (() => {
    const ownerContributor = {
      id: project.owner?.id,
      username: project.owner?.username || "Owner",
      avatarUrl: project.owner?.avatarUrl || "",
      htmlUrl: `https://github.com/${project.owner?.username}`,
      contributions: 999,
    };

    const isOwnerInContributors = contributors.some(
      (contributor) => contributor.username === ownerContributor.username
    );

    if (!isOwnerInContributors && project.owner) {
      return [ownerContributor, ...contributors];
    }

    return contributors;
  })();

  const handleContributorClick = (contributor: Contributor) => {
    navigateToProfile(contributor.id);
  };

  return (
    <div className="flex flex-1 flex-col gap-5">
      <div className="mb-2 flex flex-1 flex-col">
        <h2 className="mb-4 text-sm">Statistics</h2>

        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <Icon
              name="star"
              size="sm"
              variant="black"
              className="opacity-50"
            />
            <span className="text-sm font-normal text-neutral-500">Stars</span>
          </div>
          <div className="mx-4 flex flex-1 items-center">
            <Separator />
          </div>
          <span className="text-primary text-sm font-medium">
            {projectStats.stars}
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <Icon
              name="fork"
              size="sm"
              variant="black"
              className="opacity-50"
            />
            <span className="text-sm font-normal text-neutral-500">Forks</span>
          </div>
          <div className="mx-4 flex flex-1 items-center">
            <Separator />
          </div>
          <span className="text-primary text-sm font-medium">
            {projectStats.forks}
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <Icon name="last-commit" size="sm" variant="default" />
            <span className="text-sm font-normal text-neutral-500">
              Last Commit
            </span>
          </div>
          <div className="mx-4 flex flex-1 items-center">
            <Separator />
          </div>
          <span className="text-primary text-sm font-medium">
            {projectStats.lastCommit?.date
              ? new Date(projectStats.lastCommit.date).toLocaleDateString(
                  "fr-FR"
                )
              : "N/A"}
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <Icon
              name="people"
              size="sm"
              variant="black"
              className="opacity-50"
            />
            <span className="text-sm font-normal text-neutral-500">
              Contributors
            </span>
          </div>
          <div className="mx-4 flex flex-1 items-center">
            <Separator />
          </div>
          <span className="text-primary text-sm font-medium">
            {allContributors.length}
          </span>
        </div>
      </div>

      <div className="mb-2 flex flex-col">
        <h2 className="mb-4 text-sm">Technical Skills</h2>
        {projectTechStacks.length > 0 && (
          <div className="flex w-full flex-wrap gap-2.5 gap-y-2">
            {projectTechStacks.map((tech, index) => (
              <StackLogo
                key={index}
                name={tech.name}
                icon={tech.iconUrl || "/icons/empty-project.svg"}
                alt={tech.name}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mb-2 flex flex-col">
        <h2 className="mb-4 text-sm">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {projectCategories.map((category, index) => (
            <Badge variant="gray" key={index}>
              #{category.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mb-2 flex flex-col">
        <h2 className="mb-4 text-sm">Contributors</h2>

        <div className="flex flex-col items-start">
          <div className="ml-5 flex gap-2">
            {allContributors.slice(0, 5).map((contributor) => (
              <div
                key={contributor.id}
                className="flex items-center gap-2"
                title={contributor.username}
              >
                <Avatar
                  src={contributor.avatarUrl}
                  name={contributor.username}
                  alt={contributor.username}
                  size="md"
                  className="-ml-6 cursor-pointer border-2 border-white shadow-xs transition-transform duration-150 hover:-translate-y-0.5"
                  onClick={() => handleContributorClick(contributor)}
                />
              </div>
            ))}
          </div>
          <div className="text-muted-foreground mt-3 text-xs">
            {allContributors
              .slice(0, 3)
              .map((contributor) => contributor.username)
              .join(", ")}
            {allContributors.length > 3 && (
              <> &amp; {allContributors.length - 3} autres</>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-sm">External Links</h2>
      <ExternalLinks source={project} />
    </div>
  );
}
