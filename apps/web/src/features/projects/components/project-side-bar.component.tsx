import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import StackLogo from "@/shared/components/logos/stack-logo";
import BreadcrumbComponent from "@/shared/components/shared/Breadcrumb";
import { Avatar } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/icon";

import { Project } from "../types/project.type";

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
    lastCommitAt = "",
    projectStats = {
      stars: 0,
      forks: 0,
      contributors: 0,
    },
  } = project;

  // Récupérer le lien GitHub
  const githubLink =
    externalLinks.find((link) => link.type === "github")?.url || "";

  const collaborators = project.collaborators || [];

  const handleEditClick = () => {
    router.push(`/projects/${project.id}/edit`);
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
            Voir le Repo
            <Icon name="github" size="sm" />
          </Button>
        </Link>
      </div>

      {/* Details Section */}
      <div className="mb-2 flex flex-col">
        <h2 className="text-md mb-1 font-medium text-black">Détails</h2>

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
              Last Commit
            </span>
          </div>
          <div className="mx-4 flex flex-1 items-center">
            <div className="h-[1px] w-full bg-black/5" />
          </div>
          <span className="text-sm font-medium text-black">
            {lastCommitAt
              ? new Date(lastCommitAt).toLocaleDateString("fr-FR")
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
              Contributors
            </span>
          </div>
          <div className="mx-4 flex flex-1 items-center">
            <div className="h-[1px] w-full bg-black/5" />
          </div>
          <span className="text-sm font-medium text-black">
            {projectStats.contributors}
          </span>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="mb-2 flex flex-col">
        <h2 className="text-md mb-2 font-medium text-black">Stack Technique</h2>
        {techStacks.length > 0 && (
          <div>
            <div className="flex flex-wrap gap-2">
              {techStacks.map((tech, index) => (
                <StackLogo
                  key={index}
                  name={tech.name}
                  icon={tech.iconUrl || "/icons/empty-project.svg"}
                  alt={tech.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Categories Section */}
      <div className="mb-2 flex flex-col">
        <h2 className="text-md mb-2 font-medium text-black">Catégories</h2>
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
        <h2 className="text-md mb-2 font-medium text-black">
          Contributeurs Principaux
        </h2>
        <div>
          <div className="flex gap-2">
            {collaborators.slice(0, 5).map((collaborator) => (
              <Avatar
                key={collaborator.id}
                src={collaborator.avatarUrl}
                name={collaborator.name}
                alt={collaborator.name}
                size="sm"
              />
            ))}

            {/* Indicateur "+X autres" si plus de 5 collaborateurs */}
            {collaborators.length > 5 && (
              <div className="flex size-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                +{collaborators.length - 5}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="flex flex-col">
        <h2 className="text-md mb-2 font-medium text-black">Liens</h2>
        <div className="flex flex-wrap gap-2">
          {externalLinks.map((link, index) => {
            let iconSrc = "";
            let iconAlt = "";

            switch (link.type) {
              case "github":
                iconSrc = "/icons/github-gray-icon.svg";
                iconAlt = "GitHub";
                break;
              case "twitter":
                iconSrc = "/icons/x-gray-icon.svg";
                iconAlt = "Twitter/X";
                break;
              case "linkedin":
                iconSrc = "/icons/linkedin-gray-icon.svg";
                iconAlt = "LinkedIn";
                break;
              case "discord":
                iconSrc = "/icons/discord-gray-icon.svg";
                iconAlt = "Discord";
                break;
              case "other":
              case "website":
              default:
                iconSrc = "/icons/link-gray-icon.svg";
                iconAlt = "Website";
                break;
            }

            return (
              <Link
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={iconSrc}
                  alt={iconAlt}
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
