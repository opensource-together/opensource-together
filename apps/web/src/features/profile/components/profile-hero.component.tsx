import Link from "next/link";

import { Avatar } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";

import { Profile } from "../types/profile.type";

export function ProfileMobileHero({ profile }: ProfileHeroProps) {
  const { image = "", name = "", jobTitle = "", bio = "" } = profile;

  return (
    <div>
      <div className="flex flex-col items-start">
        <div className="flex items-center">
          <div className="mr-4">
            <Avatar src={image} name={name} alt={name} size="xl" />
          </div>
          <div>
            <h2 className="text-2xl">{name}</h2>
            <p className="text-sm tracking-tighter text-black/50">{jobTitle}</p>
          </div>
        </div>
        <p className="mt-4 mb-6 text-sm leading-6 tracking-tighter">{bio}</p>

        <Link href="/profile/me/edit" className="mt-6">
          <Button className="font-normal">Modifier le profil</Button>
        </Link>
      </div>
    </div>
  );
}

interface ProfileHeroProps {
  profile: Profile;
  hideHeader?: boolean;
}

export default function ProfileHero({
  profile,
  hideHeader = true,
}: ProfileHeroProps) {
  const { image = "", name = "", jobTitle = "", bio = "" } = profile;

  if (hideHeader) {
    return <></>;
  }

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

        <Link href="/profile/me/edit">
          <Button className="font-normal">Modifier le profil</Button>
        </Link>
      </div>

      <p className="mt-4 mb-6 text-sm leading-6 tracking-tighter">{bio}</p>
    </div>
  );
}
