import { Avatar } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/icon";

import { Profile } from "../types/profile.type";

interface PublicProfileHeroProps {
  profile: Profile;
}

export default function PublicProfileHero({ profile }: PublicProfileHeroProps) {
  const {
    avatarUrl = "",
    username = "User",
    jobTitle = "",
    bio = "",
  } = profile;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-4">
            <Avatar src={avatarUrl} name={username} alt={username} size="2xl" />
          </div>
          <div>
            <h2 className="text-2xl">{username}</h2>
            <p className="text-sm tracking-tighter text-black/50">{jobTitle}</p>
          </div>
        </div>

        <Button className="font-normal">
          <Icon name="chat" size="xs" variant="white" /> Contact
        </Button>
      </div>

      {bio && <p className="mt-4 mb-6 leading-7 tracking-tighter">{bio}</p>}
    </div>
  );
}
