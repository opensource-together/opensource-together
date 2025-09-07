import Link from "next/link";

import { Avatar } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";

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
            <Avatar src={avatarUrl} name={username} alt={username} size="xl" />
          </div>
          <div>
            <h2 className="text-2xl">{username}</h2>
            <p className="text-sm tracking-tighter text-black/50">{jobTitle}</p>
          </div>
        </div>

        <Link href="/profile/me/edit">
          <Button className="font-normal">Modifier le profil</Button>
        </Link>
      </div>

      <p className="mt-4 mb-6 text-sm leading-6 tracking-tighter">{bio}</p>
    </div>
  );
}
