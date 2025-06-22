"use client";

import useAuth from "@/features/auth/hooks/use-auth.hook";

import ProfileError from "../components/error-ui/profile-error.component";
import PinnedProjects from "../components/pinned-projects.component";
import ProfileHero from "../components/profile-hero.component";
import SkeletonProfileView from "../components/skeletons/skeleton-profile-view.component";

export default function ProfileView() {
  const { currentUser, isLoading, isError } = useAuth();

  if (isLoading) return <SkeletonProfileView />;
  if (isError || !currentUser) return <ProfileError />;

  return (
    <div className="mx-auto mt-4 flex max-w-[1300px] flex-col items-center justify-center gap-5 px-4 sm:px-6 md:mt-8 md:px-8 lg:px-24 xl:px-40">
      <div className="w-full lg:max-w-[721.96px]">
        <ProfileHero profile={currentUser} />
      </div>

      {/* Section des projets pinnés en dessous */}
      <div className="mt-0 mb-30 flex w-full flex-col items-center justify-center lg:pl-0">
        <div className="flex flex-col gap-6 lg:max-w-[731px]">
          <PinnedProjects profile={currentUser} />
        </div>
      </div>
    </div>
  );
}
