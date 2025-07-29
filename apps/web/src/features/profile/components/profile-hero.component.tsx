import Link from "next/link";

import { Avatar } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/icon";

import { Profile } from "../types/profile.type";

interface ProfileHeroProps {
  profile: Profile;
}

export default function ProfileHero({ profile }: ProfileHeroProps) {
  const { avatarUrl = "", username = "", jobTitle = "", bio = "" } = profile;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-4">
            <Avatar src={avatarUrl} name={username} alt={username} size="2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-medium tracking-tighter">{username}</h2>
            <p className="text-sm tracking-tighter text-black/50">{jobTitle}</p>
          </div>
        </div>

        <Link href="/profile/edit">
          <Button className="font-normal">
            Modifier le profil <Icon name="pencil" size="xs" variant="white" />
          </Button>
        </Link>
      </div>

      <p className="mt-4 mb-6 leading-7 tracking-tighter">{bio}</p>
    </div>
  );
}
