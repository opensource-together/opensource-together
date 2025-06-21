"use client";

import PinnedProjects from "../components/PinnedProjects";
import ProfileHero from "../components/ProfileHero";
import ProfileError from "../components/error-ui/ProfileError";
import SkeletonProfilePageView from "../components/skeletons/SkeletonProfilePageView";
import { useCurrentUserProfile } from "../hooks/useProfile";

export default function ProfileView() {
  const { data: profile, isLoading, isError } = useCurrentUserProfile();

  if (isLoading) return <SkeletonProfilePageView />;
  if (isError || !profile) return <ProfileError />;

  console.log({ profile });
  return (
    <div className="mx-auto mt-4 flex max-w-[1300px] flex-col items-center justify-center gap-5 px-4 sm:px-6 md:mt-8 md:px-8 lg:px-24 xl:px-40">
      <div className="w-full lg:max-w-[721.96px]">
        <ProfileHero profile={profile} />
      </div>

      {/* Section des projets pinnés en dessous */}
      <div className="mt-0 mb-30 flex w-full flex-col items-center justify-center lg:pl-0">
        <div className="flex flex-col gap-6 lg:max-w-[731px]">
          <PinnedProjects profile={profile} />
        </div>
      </div>
    </div>
  );
}
