import Image from "next/image";
import Link from "next/link";

import StackLogo from "@/shared/components/logos/stack-logo";
import BreadcrumbComponent from "@/shared/components/shared/Breadcrumb";
import Icon from "@/shared/components/ui/icon";

import { Profile } from "../types/profile.type";

interface ProfileSidebarProps {
  profile: Profile;
}

export default function ProfileSidebar({ profile }: ProfileSidebarProps) {
  const { techStacks = [], socialLinks = {} } = profile;
  const breadcrumbItems = [
    {
      label: "Discover",
      href: "/",
      isActive: false,
    },
    {
      label: profile.username || "Profile",
      isActive: true,
    },
  ];

  const defaultStats = {
    starsEarned: 54,
    joinedProjects: 34,
    contributions: 5,
  };

  // Utiliser les données du profil ou les valeurs par défaut
  const stats = defaultStats; // À adapter selon les données réelles du profil

  const formatUrl = (url: string) => {
    if (!url) return "";
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname;
    } catch {
      return url;
    }
  };

  const socialLinksConfig = [
    { key: "github", icon: "/icons/github-gray-icon.svg", alt: "GitHub" },
    { key: "twitter", icon: "/icons/x-gray-icon.svg", alt: "Twitter/X" },
    { key: "linkedin", icon: "/icons/linkedin-gray-icon.svg", alt: "LinkedIn" },
    { key: "discord", icon: "/icons/discord-gray.svg", alt: "Discord" },
    { key: "website", icon: "/icons/link-gray-icon.svg", alt: "Website" },
  ];

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
            <Icon name="star" size="sm" variant="black" />
            <span className="text-sm font-normal text-black">
              Stars gagnées
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
            <Icon name="fork" size="sm" variant="black" />
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
            <Icon name="people" size="sm" variant="black" />
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
        {techStacks.length > 0 ? (
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
        <h2 className="text-md mb-4 font-medium tracking-tight text-black">
          Liens externes
        </h2>
        <div className="flex flex-col gap-6">
          {socialLinksConfig.map((config) => {
            const url = socialLinks[config.key as keyof typeof socialLinks];
            if (!url) return null;

            return (
              <Link
                key={config.key}
                href={url}
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
                <span className="truncate">{formatUrl(url)}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
