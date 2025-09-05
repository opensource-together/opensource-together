import Link from "next/link";
import { useRouter } from "next/navigation";

import StackLogo from "@/shared/components/logos/stack-logo";
import { Avatar } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import BreadcrumbNavigation from "@/shared/components/ui/breadcrumb-navigation";
import { Button } from "@/shared/components/ui/button";
import { Icon, IconName } from "@/shared/components/ui/icon";
import { Separator } from "@/shared/components/ui/separator";

import { Contributor, Project } from "../types/project.type";

interface ProjectSideBarProps {
  project: Project;
  isMaintainer?: boolean;
}

const externalLinksConfig = [
  { key: "github", icon: "github", alt: "GitHub" },
  { key: "twitter", icon: "twitter", alt: "Twitter/X" },
  { key: "linkedin", icon: "linkedin", alt: "LinkedIn" },
  { key: "discord", icon: "discord", alt: "Discord" },
  { key: "website", icon: "link", alt: "Website" },
];

export default function ProjectSideBar({
  project,
  isMaintainer = false,
}: ProjectSideBarProps) {
  const router = useRouter();
  const {
    title = "",
    techStacks = [],
    externalLinks = [],
    categories = [],
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

  const githubLink =
    externalLinks.find((link) => link.type === "github")?.url || "";

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

  const handleEditClick = () => {
    router.push(`/projects/${project.id}/edit`);
  };

  const handleContributorClick = (contributor: Contributor) => {
    const userId = contributor.id;
    router.push(`/profile/${userId}`);
  };

  const breadcrumbItems = [
    {
      label: "Accueil",
      href: "/",
      isActive: false,
    },
    {
      label: title,
      isActive: true,
    },
  ];

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

      <div className="mb-3 flex gap-2">
        {isMaintainer ? (
          <Button size="lg" className="gap-2" onClick={handleEditClick}>
            Modifier
            <Icon name="pencil" size="xs" variant="white" />
          </Button>
        ) : (
          <Button size="lg">Rejoindre le projet</Button>
        )}
        <Link href={githubLink} target="_blank" rel="noopener noreferrer">
          <Button variant="secondary" size="lg">
            Voir Repository
          </Button>
        </Link>
      </div>

      <div className="mb-2 flex flex-1 flex-col">
        <h2 className="text-md mb-1">Détails</h2>

        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <Icon
              name="star"
              size="sm"
              variant="black"
              className="opacity-50"
            />
            <span className="text-sm font-normal text-black/50">Stars</span>
          </div>
          <div className="mx-4 flex flex-1 items-center">
            <Separator />
          </div>
          <span className="text-sm font-medium text-black">
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
            <span className="text-sm font-normal text-black/50">Forks</span>
          </div>
          <div className="mx-4 flex flex-1 items-center">
            <Separator />
          </div>
          <span className="text-sm font-medium text-black">
            {projectStats.forks}
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <Icon name="last-commit" size="sm" variant="default" />
            <span className="text-sm font-normal text-black/50">
              Dernier Commit
            </span>
          </div>
          <div className="mx-4 flex flex-1 items-center">
            <Separator />
          </div>
          <span className="text-sm font-medium text-black">
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
            <span className="text-sm font-normal text-black/50">
              Contributeurs
            </span>
          </div>
          <div className="mx-4 flex flex-1 items-center">
            <Separator />
          </div>
          <span className="text-sm font-medium text-black">
            {allContributors.length}
          </span>
        </div>
      </div>

      <div className="mb-2 flex flex-col">
        <h2 className="text-md mb-2">Technologies</h2>
        {techStacks.length > 0 && (
          <div className="flex w-full flex-wrap gap-x-5 gap-y-2">
            {techStacks.map((tech, index) => (
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
        <h2 className="text-md mb-2">Catégories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <Badge
              key={index}
              className="flex h-[20px] min-w-[65px] items-center justify-center rounded-full bg-[#FAFAFA] px-3 text-xs font-medium text-black/50"
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mb-2 flex flex-col">
        <h2 className="text-md mb-3">Contributeurs Principaux</h2>

        <div className="flex flex-col items-start">
          <div className="ml-3 flex gap-2">
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
                  size="sm"
                  className="-ml-4 cursor-pointer border-2 border-white transition-transform duration-150 hover:-translate-y-0.5"
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

      {externalLinks.length > 0 && (
        <div className="mb-2 flex flex-col">
          <h2 className="text-md mb-4">Liens externes</h2>
          <div className="flex flex-col gap-6">
            {externalLinksConfig.map((config) => {
              const link = externalLinks.find((l) =>
                config.key === "website"
                  ? l.type === "website" || l.type === "other"
                  : l.type === config.key
              );
              if (!link) return null;

              return (
                <Link
                  key={config.key}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group text-muted-foreground flex items-center gap-2 text-sm transition-colors hover:text-black"
                >
                  <Icon
                    name={config.icon as IconName}
                    size="md"
                    variant="gray"
                    className="opacity-50 transition-opacity group-hover:opacity-100"
                    alt={config.alt}
                  />
                  <span className="truncate">{formatUrl(link.url)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
