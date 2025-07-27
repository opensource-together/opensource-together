import Image from "next/image";
import Link from "next/link";

import StackLogo from "@/shared/components/logos/stack-logo";
import BreadcrumbComponent from "@/shared/components/shared/Breadcrumb";

import { Profile } from "../types/profile.type";

interface ProfileSidebarProps {
  profile: Profile;
}

export default function ProfileSidebar({ profile }: ProfileSidebarProps) {
  const breadcrumbItems = [
    {
      label: "Discover",
      href: "/",
      isActive: false,
    },
    {
      label: profile.name || "Profile",
      isActive: true,
    },
  ];

  const defaultStats = {
    starsEarned: 54,
    joinedProjects: 34,
    contributions: 5,
  };

  const defaultLinks = [
    { type: "twitter" as const, url: "https://x.com/zinedinechm" },
    { type: "linkedin" as const, url: "https://linkedin.com/in/zine-chm" },
    { type: "github" as const, url: "https://github.com/zinedinechm" },
    { type: "link" as const, url: "https://zinedine.ch" },
  ];

  // Utiliser les données du profil ou les valeurs par défaut
  const stats = defaultStats; // À adapter selon les données réelles du profil
  const techStacks = profile.techStacks || [];
  const links = profile.links || defaultLinks;

  const getIconSrc = (type: string) => {
    switch (type) {
      case "github":
        return "/icons/github-gray-icon.svg";
      case "twitter":
        return "/icons/x-gray-icon.svg";
      case "linkedin":
        return "/icons/linkedin-gray-icon.svg";
      case "link":
      default:
        return "/icons/link-gray-icon.svg";
    }
  };

  const getDisplayText = (url: string, type: string) => {
    if (type === "github") {
      const match = url.match(/github\.com\/([^\/]+)/);
      return match ? `@${match[1]}` : url;
    }
    if (type === "twitter") {
      const match = url.match(/x\.com\/([^\/]+)/);
      return match ? `@${match[1]}` : url;
    }
    if (type === "linkedin") {
      const match = url.match(/linkedin\.com\/in\/([^\/]+)/);
      return match ? `@${match[1]}` : url;
    }
    return url;
  };

  return (
    <div className="flex w-[252px] flex-col gap-5">
      {/* Breadcrumb */}
      <BreadcrumbComponent items={breadcrumbItems} className="mb-3" />

      {/* Stats Section */}
      <div className="mb-2 flex flex-col md:max-w-[263px]">
        <h2 className="text-md mb-1 font-medium tracking-tight text-black">
          Statistiques
        </h2>

        {/* Stars Earned */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <Image
              src="/icons/black-star-icon.svg"
              alt="star"
              width={12}
              height={10}
              className=""
            />
            <span className="text-sm font-normal text-black">
              Étoiles gagnées
            </span>
          </div>
          <div className="mx-4 flex flex-1 items-center">
            <div className="h-[1px] w-full bg-black/5" />
          </div>
          <span className="text-sm font-medium text-black">
            {stats.starsEarned}
          </span>
        </div>

        {/* Joined Projects */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <Image
              src="/icons/joined-project-icon.svg"
              alt="projects"
              width={11}
              height={10}
              className=""
            />
            <span className="text-sm font-normal text-black">
              Projets rejoints
            </span>
          </div>
          <div className="mx-4 flex flex-1 items-center">
            <div className="h-[1px] w-full bg-black/5" />
          </div>
          <span className="text-sm font-medium text-black">
            {stats.joinedProjects}
          </span>
        </div>

        {/* Contributions */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <Image
              src="/icons/contributor-icon.svg"
              alt="contributions"
              width={12}
              height={8}
              className="mt-[2px]"
            />
            <span className="text-sm font-normal text-black">
              Contributions
            </span>
          </div>
          <div className="mx-4 flex flex-1 items-center">
            <div className="h-[1px] w-full bg-black/5" />
          </div>
          <span className="text-sm font-medium text-black">
            {stats.contributions}
          </span>
        </div>
      </div>

      {/* Skills Section */}
      <div className="mb-2 flex flex-col">
        <h2 className="text-md mb-2 font-medium tracking-tight text-black">
          Technologies
        </h2>
        {techStacks && techStacks.length > 0 ? (
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

      {/* External Links Section */}
      <div className="mb-2 flex flex-col">
        <h2 className="text-md mb-2 font-medium tracking-tight text-black">
          Liens externes
        </h2>
        <div className="flex flex-col gap-2">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
            >
              <Image
                src={getIconSrc(link.type)}
                alt={link.type}
                width={20}
                height={20}
                className="opacity-50"
              />
              <span className="text-sm font-normal text-black/70">
                {getDisplayText(link.url, link.type)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
