import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import StackLogo from "@/shared/components/logos/stack-logo";
import BreadcrumbComponent from "@/shared/components/shared/Breadcrumb";
import { Avatar } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/icon";

import { GithubContributor, Project } from "../types/project.type";

interface ProjectSideBarProps {
  project: Project;
  isMaintainer?: boolean;
}

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

  // Create a list that includes the owner first, then the contributors
  const allContributors = (() => {
    const ownerContributor = {
      login: project.author?.name || "Owner",
      avatar_url: project.author?.avatarUrl || "",
      html_url: `https://github.com/${project.author?.name}`,
      contributions: 999, // To ensure it's first
    };

    // Check if the owner is already in the contributors
    const isOwnerInContributors = contributors.some(
      (contributor) => contributor.login === ownerContributor.login
    );

    // If the owner is not already in the list, add it first
    if (!isOwnerInContributors && project.author) {
      return [ownerContributor, ...contributors];
    }

    return contributors;
  })();

  const handleEditClick = () => {
    router.push(`/projects/${project.id}/edit`);
  };

  const handleContributorClick = (contributor: GithubContributor) => {
    // Pour l'instant, utiliser le login GitHub comme ID
    // TODO: Remplacer par le vrai ID utilisateur quand disponible
    const userId = contributor.login;
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

  const externalLinksConfig = [
    { key: "github", icon: "/icons/github-gray-icon.svg", alt: "GitHub" },
    { key: "twitter", icon: "/icons/x-gray-icon.svg", alt: "Twitter/X" },
    { key: "linkedin", icon: "/icons/linkedin-gray-icon.svg", alt: "LinkedIn" },
    { key: "discord", icon: "/icons/discord-gray.svg", alt: "Discord" },
    { key: "website", icon: "/icons/link-gray-icon.svg", alt: "Website" },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb */}
      <BreadcrumbComponent items={breadcrumbItems} className="mb-3" />

      {/* Action Buttons */}
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
          <Button variant="outline" size="lg">
            Voir Repository
          </Button>
        </Link>
      </div>

      {/* Details Section */}
      <div className="mb-2 flex flex-col md:max-w-[263px]">
        <h2 className="text-md mb-1 font-medium tracking-tight text-black">
          Détails
        </h2>

        {/* Stars */}
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
            <div className="h-[1px] w-full bg-black/5" />
          </div>
          <span className="text-sm font-medium text-black">
            {projectStats.stars}
          </span>
        </div>

        {/* Forks */}
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
            <div className="h-[1px] w-full bg-black/5" />
          </div>
          <span className="text-sm font-medium text-black">
            {projectStats.forks}
          </span>
        </div>

        {/* Last Commit */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <Icon name="last-commit" size="sm" variant="default" />
            <span className="text-sm font-normal text-black/50">
              Dernier Commit
            </span>
          </div>
          <div className="mx-4 flex flex-1 items-center">
            <div className="h-[1px] w-full bg-black/5" />
          </div>
          <span className="text-sm font-medium text-black">
            {projectStats.lastCommit?.date
              ? new Date(projectStats.lastCommit.date).toLocaleDateString(
                  "fr-FR"
                )
              : "N/A"}
          </span>
        </div>

        {/* Contributors */}
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
            <div className="h-[1px] w-full bg-black/5" />
          </div>
          <span className="text-sm font-medium text-black">
            {allContributors.length}
          </span>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="mb-2 flex flex-col">
        <h2 className="text-md mb-2 font-medium tracking-tight text-black">
          Technologies
        </h2>
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

      {/* Categories Section */}
      <div className="mb-2 flex flex-col">
        <h2 className="text-md mb-2 font-medium tracking-tight text-black">
          Catégories
        </h2>
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

      {/* Contributors Section */}
      <div className="mb-2 flex flex-col">
        <h2 className="text-md mb-3 font-medium tracking-tight text-black">
          Contributeurs Principaux
        </h2>

        <div className="flex flex-col items-start">
          <div className="ml-3 flex gap-2">
            {allContributors.slice(0, 5).map((contributor) => (
              <div
                key={contributor.login}
                className="flex items-center gap-2"
                title={contributor.login}
              >
                <Avatar
                  src={contributor.avatar_url}
                  name={contributor.login}
                  alt={contributor.login}
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
              .map((contributor) => contributor.login)
              .join(", ")}
            {allContributors.length > 3 && (
              <> &amp; {allContributors.length - 3} autres</>
            )}
          </div>
        </div>
      </div>

      {/* Links Section */}
      {externalLinks.length > 0 && (
        <div className="mb-2 flex flex-col">
          <h2 className="text-md mb-4 font-medium tracking-tight text-black">
            Liens externes
          </h2>
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
                  <Image
                    src={config.icon}
                    alt={config.alt}
                    width={24}
                    height={24}
                    className="size-5 opacity-50 transition-opacity group-hover:opacity-100"
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
