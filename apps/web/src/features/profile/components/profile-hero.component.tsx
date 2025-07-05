import { Avatar } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/icon";
import { getRoleBadgeVariant } from "@/shared/lib/utils/badges";

import { Profile } from "../types/profile.type";

interface ProfileHeroProps {
  profile: Profile;
}

export default function ProfileHero({ profile }: ProfileHeroProps) {
  const {
    avatarUrl = "",
    name = "User",
    joinedAt = "N/A",
    bio = "",
    skills = [],
    socialLinks = [],
  } = profile;

  const formatJoinDate = (dateString: string) => {
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime())
      ? "Date inconnue"
      : parsedDate.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-4">
            <Avatar src={avatarUrl} name={name} alt={name} size="2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-medium tracking-tighter">{name}</h2>
            <p className="text-sm tracking-tighter text-black/50">
              Rejoint le {formatJoinDate(joinedAt)}
            </p>
          </div>
        </div>
        {socialLinks.length > 0 && (
          <div className="flex items-center justify-end space-x-3">
            <div className="flex items-center space-x-3">
              {socialLinks.map((link) => (
                <button key={link.type}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <Icon
                      name={link.type}
                      size="md"
                      variant="black"
                      interactive
                    />
                  </a>
                </button>
              ))}
            </div>
            <Button className="font-normal">
              Contact <Icon name="discord" size="md" variant="white" />
            </Button>
          </div>
        )}
      </div>

      <p className="mt-4 mb-6 leading-7 tracking-tighter">{bio}</p>
      <div className="flex-grow border-t border-black/5" />

      {skills.map((skill, index) => (
        <div key={index}>
          <div className="mt-10 mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium tracking-tighter">
              Compétences techniques
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
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
          </div>
        </div>
      ))}
    </div>
  );
}
