import { IoChatbox } from "react-icons/io5";

import { Avatar } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";

import { Profile } from "../types/profile.type";

interface PublicProfileHeroProps {
  profile: Profile;
}

export default function PublicProfileHero({ profile }: PublicProfileHeroProps) {
  const { image = "", name = "User", jobTitle = "", bio = "" } = profile;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-4">
            <Avatar src={image} name={name} alt={name} size="xl" />
          </div>
          <div>
            <h2 className="text-2xl">{name}</h2>
            <p className="text-sm tracking-tighter text-black/50">{jobTitle}</p>
          </div>
        </div>

        <Button className="gap-1 font-normal">
          Contact <IoChatbox className="size-3.5" />
        </Button>
      </div>

      {bio && (
        <p className="mt-4 mb-6 text-sm leading-6 tracking-tighter">{bio}</p>
      )}
    </div>
  );
}
