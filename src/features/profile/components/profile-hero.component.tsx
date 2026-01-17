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

import type { Profile } from "../types/profile.type";

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
    banner = "",
    name = "",
    jobTitle = "",
    bio = "",
    betaTester = false,
    updatedAt,
  } = profile;

  const publicProfileUrl = `${FRONTEND_URL}/profile/${id}`;
  const imageUrlWithCacheBusting = useCacheBustingImage(image, updatedAt);
  const bannerUrlWithCacheBusting = useCacheBustingImage(banner, updatedAt);

  const renderBetaTesterBadge = () => {
    if (!betaTester) return null;
    return (
      <TooltipRoot>
        <TooltipTrigger asChild>
          <Image
            src="/icons/early-badge.svg"
            alt="Beta Tester"
            width={20}
            height={20}
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
      <div className="relative mb-10 w-full overflow-visible rounded-lg">
        <div className="relative w-full overflow-hidden rounded-lg">
          <Image
            src={bannerUrlWithCacheBusting || "/ost-profile-banner.png"}
            alt={`${name}'s banner`}
            width={677}
            height={150}
            className="h-28 w-full object-cover"
            priority
            unoptimized
          />
        </div>
        <div className="absolute -bottom-8 z-20">
          <Avatar
            src={imageUrlWithCacheBusting}
            name={name}
            alt={name}
            size="xl"
          />
        </div>
      </div>

      <div className="flex flex-col items-start">
        <div className="flex min-w-0 items-center">
          <div className="min-w-0">
            <div className="flex items-center">
              <h2 className="max-w-[65vw] truncate text-start font-medium text-2xl">
                {name}
              </h2>
              {renderBetaTesterBadge()}
            </div>
            <p className="max-w-[65vw] truncate text-muted-foreground text-sm tracking-tighter">
              {jobTitle}
            </p>
          </div>
        </div>

        <p className="mt-4 mb-8 line-clamp-5 break-words font-normal text-sm">
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
    banner = "",
    name = "",
    jobTitle = "",
    bio = "",
    betaTester = false,
    updatedAt,
  } = profile;

  const publicProfileUrl = `${FRONTEND_URL}/profile/${id}`;
  const imageUrlWithCacheBusting = useCacheBustingImage(image, updatedAt);
  const bannerUrlWithCacheBusting = useCacheBustingImage(banner, updatedAt);

  if (hideHeader) {
    return null;
  }

  const renderBetaTesterBadge = () => {
    if (!betaTester) return null;
    return (
      <TooltipRoot>
        <TooltipTrigger asChild>
          <Image
            src="/icons/early-badge.svg"
            alt="Beta Tester"
            width={20}
            height={20}
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
      <div className="relative w-full overflow-visible rounded-[20px] border border-muted-black-stroke/10">
        <div className="relative w-full overflow-hidden rounded-[20px]">
          <Image
            src={bannerUrlWithCacheBusting || "/ost-profile-banner.png"}
            alt={`${name}'s banner`}
            width={1500}
            height={150}
            className="h-36 w-full object-cover"
            priority
            unoptimized
          />
        </div>
        <div className="absolute -bottom-10 z-20">
          <Avatar
            src={imageUrlWithCacheBusting}
            name={name}
            alt={name}
            size="2xl"
          />
        </div>
      </div>

      <div className="flex items-start justify-between pt-12">
        <div className="flex min-w-0 flex-1 items-center">
          <div className="min-w-0">
            <div className="flex items-center">
              <h2 className="max-w-[65vw] truncate text-start font-medium text-2xl">
                {name}
              </h2>
              {renderBetaTesterBadge()}
            </div>
            <p className="truncate text-muted-foreground text-sm tracking-tighter">
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
