import Image from "next/image";
import Link from "next/link";
import { RiLinkM } from "react-icons/ri";

import { FRONTEND_URL } from "@/config/config";

import { Avatar } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { ShareProfileModal } from "@/shared/components/ui/share-profile-modal.component";
import {
  TooltipContent,
  TooltipRoot,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { useCacheBustingImage } from "@/shared/hooks/use-cache-busting-image.hook";

import { Profile } from "../types/profile.type";

interface ProfileHeroProps {
  profile: Profile;
  hideHeader?: boolean;
  variant?: "private" | "public";
}

export function ProfileMobileHero({
  profile,
  variant = "private",
}: ProfileHeroProps) {
  const {
    id,
    image = "",
    name = "",
    jobTitle = "",
    bio = "",
    betaTester = false,
    updatedAt,
  } = profile;

  const publicProfileUrl = `${FRONTEND_URL}/profile/${id}`;
  const imageUrlWithCacheBusting = useCacheBustingImage(image, updatedAt);

  const renderBetaTesterBadge = () => {
    if (!betaTester) return null;
    return (
      <TooltipRoot>
        <TooltipTrigger asChild>
          <Image
            src="/early-badge.svg"
            alt="Beta Tester"
            width={24}
            height={24}
            className="-mt-0.5 ml-0.5"
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>Early Adopter</p>
        </TooltipContent>
      </TooltipRoot>
    );
  };

  const renderActionButton = () => {
    // Feature post-launch
    if (variant === "public") {
      return null;
    }

    return (
      <div className="flex items-center gap-2">
        <ShareProfileModal
          url={publicProfileUrl}
          title={name}
          description="Share your profile with your friends and followers."
          triggerIcon={RiLinkM}
          triggerVariant="outline"
          triggerSize="icon"
          triggerClassName="size-9"
        />
        <Link href="/profile/me/edit">
          <Button>Edit Profile</Button>
        </Link>
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col items-start">
        <div className="flex min-w-0 items-center">
          <div className="mr-4">
            <Avatar
              src={imageUrlWithCacheBusting}
              name={name}
              alt={name}
              size="xl"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center">
              <h2 className="max-w-[65vw] truncate text-start text-2xl font-medium">
                {name}
              </h2>
              {renderBetaTesterBadge()}
            </div>
            <p className="text-muted-foreground max-w-[65vw] truncate text-sm tracking-tighter">
              {jobTitle}
            </p>
          </div>
        </div>

        <p className="mt-4 mb-8 line-clamp-5 text-sm font-normal break-words">
          {bio}
        </p>
        {renderActionButton()}
      </div>
    </div>
  );
}

export default function ProfileHero({
  profile,
  variant = "private",
  hideHeader = true,
}: ProfileHeroProps) {
  const {
    id,
    image = "",
    name = "",
    jobTitle = "",
    bio = "",
    betaTester = false,
    updatedAt,
  } = profile;

  const publicProfileUrl = `${FRONTEND_URL}/profile/${id}`;
  const imageUrlWithCacheBusting = useCacheBustingImage(image, updatedAt);

  if (hideHeader) {
    return <></>;
  }

  const renderBetaTesterBadge = () => {
    if (!betaTester) return null;
    return (
      <TooltipRoot>
        <TooltipTrigger asChild>
          <Image
            src="/early-badge.svg"
            alt="Beta Tester"
            width={24}
            height={24}
            className="-mt-0.5 ml-0.5"
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>Early Adopter</p>
        </TooltipContent>
      </TooltipRoot>
    );
  };
  const renderActionButton = () => {
    // Feature post-launch
    if (variant === "public") {
      return null;
    }

    return (
      <div className="flex items-center gap-2">
        <ShareProfileModal
          url={publicProfileUrl}
          title={name}
          description="Share your profile with your friends and followers."
          triggerIcon={RiLinkM}
          triggerVariant="outline"
          triggerSize="icon"
          triggerClassName="size-9"
        />
        <Link href="/profile/me/edit">
          <Button>Edit Profile</Button>
        </Link>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center">
          <div className="mr-4">
            <Avatar
              src={imageUrlWithCacheBusting}
              name={name}
              alt={name}
              size="xl"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center">
              <h2 className="max-w-[65vw] truncate text-start text-2xl font-medium">
                {name}
              </h2>
              {renderBetaTesterBadge()}
            </div>
            <p className="text-muted-foreground truncate text-sm tracking-tighter">
              {jobTitle}
            </p>
          </div>
        </div>

        {renderActionButton()}
      </div>

      <p className="mt-4 text-sm leading-6">{bio}</p>
    </div>
  );
}
