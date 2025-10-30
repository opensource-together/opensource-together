import Link from "next/link";
import { IoChatbox } from "react-icons/io5";

import { Avatar } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";

import { Profile } from "../types/profile.type";

interface ProfileHeroProps {
  profile: Profile;
  hideHeader?: boolean;
  variant?: "private" | "public";
}

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
        <p className="mt-4 text-sm leading-6 tracking-tighter">{bio}</p>

        <Link href="/profile/me/edit" className="mt-6">
          <Button>Edit Profile</Button>
        </Link>
      </div>
    </div>
  );
}

export default function ProfileHero({
  profile,
  hideHeader = true,
  variant = "private",
}: ProfileHeroProps) {
  const { image = "", name = "", jobTitle = "", bio = "" } = profile;

  if (hideHeader) {
    return <></>;
  }

  const renderActionButton = () => {
    if (variant === "public") {
      return (
        <Button className="gap-1 font-normal">
          Contact <IoChatbox className="size-3.5" />
        </Button>
      );
    }

    return (
      <Link href="/profile/me/edit">
        <Button>Edit Profile</Button>
      </Link>
    );
  };

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

        {renderActionButton()}
      </div>

      <p className="mt-4 text-sm leading-6 tracking-tighter">{bio}</p>
    </div>
  );
}
