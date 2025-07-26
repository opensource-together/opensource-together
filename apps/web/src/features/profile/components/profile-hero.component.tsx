import Image from "next/image";
import Link from "next/link";

import { Avatar } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/icon";
import { TechStackList } from "@/shared/components/ui/tech-stack-list.component";

import { Profile } from "../types/profile.type";

interface ProfileHeroProps {
  profile: Profile;
}

export default function ProfileHero({ profile }: ProfileHeroProps) {
  const {
    avatarUrl = "",
    name = "User",
    jobTitle = "",
    bio = "",
    techStacks = [],
    socialLinks = {},
  } = profile;

  // Convertir l'objet socialLinks en array pour l'affichage
  const socialLinksArray = Object.entries(socialLinks)
    .filter(([_, url]) => url && url.trim() !== "")
    .map(([type, url]) => ({
      type: type as
        | "github"
        | "twitter"
        | "linkedin"
        | "discord"
        | "other"
        | "website",
      url: url as string,
    }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-4">
            <Avatar src={avatarUrl} name={name} alt={name} size="2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-medium tracking-tighter">{name}</h2>
            <p className="text-sm tracking-tighter text-black/50">{jobTitle}</p>
          </div>
        </div>
        {socialLinksArray.length > 0 && (
          <div className="flex items-center justify-end space-x-3">
            <div className="flex items-center space-x-2">
              {socialLinksArray.map((link, index) => {
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
                    iconSrc = "/icons/discord-gray.svg";
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
                      width={24}
                      height={24}
                      className="size-6"
                    />
                  </Link>
                );
              })}
            </div>
            <Link href="/profile/edit">
              <Button className="font-normal">
                Modifier le profil{" "}
                <Icon name="pencil" size="xs" variant="white" />
              </Button>
            </Link>
          </div>
        )}
      </div>

      <p className="mt-4 mb-6 leading-7 tracking-tighter">{bio}</p>
      <div className="flex-grow border-t border-black/5" />

      {techStacks && techStacks.length > 0 && (
        <div>
          <div className="mt-10 mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium tracking-tighter">
              Compétences techniques
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {techStacks.map((techStack) => (
              <div key={techStack.id}>
                <TechStackList techStackIds={[techStack.id]} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
