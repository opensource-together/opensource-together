"use client";

import Image from "next/image";

import PinnedProjects from "../components/PinnedProjects";
import ProfileHero from "../components/ProfileHero";
import ProfileSidebar from "../components/ProfileSidebar";
import ProfileError from "../components/error-ui/ProfileError";
import SkeletonProfilePageView from "../components/skeletons/SkeletonProfilePageView";
import { useCurrentUserProfile } from "../hooks/useProfile";

export default function ProfileView() {
  const { data: profile, isLoading, isError } = useCurrentUserProfile();

  if (isLoading || !profile) return <SkeletonProfilePageView />;
  if (isError) return <ProfileError />;

  return (
    <div className="mx-auto mt-4 flex max-w-[1300px] flex-col gap-8 px-4 sm:px-6 md:mt-8 md:px-8 lg:px-24 xl:px-40">
      {/* Section du haut avec le profil et la sidebar */}
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:gap-16">
        <div className="w-full lg:max-w-[721.96px]">
          <ProfileHero profile={profile} />
        </div>
        <ProfileSidebar profile={profile} />
      </div>

      {/* Section des projets pinnés en dessous */}
      <div className="mt-2 mb-30 w-full lg:pl-0">
        <h2 className="mb-10 flex items-center gap-1 text-xl font-medium">
          Projets Épinglés{" "}
          <Image
            src="/icons/pinned-icon.svg"
            alt="pinnedicon"
            width={18}
            height={17}
          />
        </h2>
        <div className="flex flex-col gap-6 lg:max-w-[731px]">
          <PinnedProjects profile={profile} />
        </div>
      </div>
    </div>
  );
}
