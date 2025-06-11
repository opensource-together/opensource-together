import Image from "next/image";

import { getRoleBadgeVariant } from "@/lib/utils/badges";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Profile } from "../types/profileTypes";

interface ProfileHeroProps {
  profile: Profile;
}

export default function ProfileHero({ profile }: ProfileHeroProps) {
  const { avatar_url, name, created_at, bio, skills, experiences, links } =
    profile;
  return (
    <div className="my-10 h-auto w-full rounded-3xl border border-black/5 bg-white px-8 pb-10 shadow-xs sm:w-[488px] lg:w-[711.96px]">
      <div className="relative top-[-15px] flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative top-[-20px] mr-4">
            <Image
              src={avatar_url}
              alt="Profile"
              width={120}
              height={120}
              className="rounded-full"
            />
          </div>
          <div>
            <h2 className="text-2xl font-medium">{name}</h2>
            <p className="text-[11px] text-black/50">
              Rejoint le{" "}
              {created_at
                ? new Date(created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end space-x-3">
          <div className="flex items-center space-x-3">
            <button>
              <a
                href={links?.find((link) => link.type === "x")?.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/icons/x.svg" alt="x" width={19} height={19} />
              </a>
            </button>
            <button>
              <a
                href={links?.find((link) => link.type === "linkedin")?.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/icons/linkedin.svg"
                  alt="linkedin"
                  width={17}
                  height={19}
                />
              </a>
            </button>
            <button>
              <a
                href={links?.find((link) => link.type === "github")?.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/icons/github.svg"
                  alt="github"
                  width={19}
                  height={19}
                />
              </a>
            </button>
          </div>
          <Button className="font-normal">
            Contact{" "}
            <Image
              src="/icons/discord-icon.svg"
              alt="arrow-right"
              width={15}
              height={15}
            />
          </Button>
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-medium text-black/30">A propos</h3>
        <div className="ml-4 flex-grow border-t border-dashed border-[black]/10" />
      </div>
      <p className="mb-6 text-sm font-medium text-black">{bio}</p>

      <div className="my-5 flex items-center justify-between">
        <h3 className="text-sm font-medium text-black/30">Experiences</h3>
        <div className="ml-4 flex-grow border-t border-dashed border-[black]/10" />
      </div>
      <div>
        {experiences?.map((experience) => (
          <div key={experience.id} className="mb-4 flex text-sm font-normal">
            <p className="mr-5 text-black/50">
              {experience.startDate.slice(0, 4)} -{" "}
              {experience.endDate.slice(0, 4)}
            </p>
            <p className="mr-1">{experience.position}</p>
            <h4 className="font-medium">@{experience.company}</h4>
          </div>
        ))}
      </div>

      <div className="my-5 flex items-center justify-between">
        <h3 className="text-sm font-medium text-black/30">
          Compétences techniques
        </h3>
        <div className="ml-4 flex-grow border-t border-dashed border-[black]/10" />
      </div>
      <div className="flex flex-wrap gap-2">
        {skills?.map((skill, index) => (
          <Badge
            key={index}
            style={{
              color: skill.badges[0].color,
              backgroundColor: skill.badges[0].bgColor,
            }}
            variant={getRoleBadgeVariant(skill.name)}
            className="text-xs"
          >
            {skill.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}
