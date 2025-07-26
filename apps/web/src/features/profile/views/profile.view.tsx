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
    <div className="mx-4 mt-4 flex w-full max-w-2xl flex-col items-center justify-center gap-5 md:mx-auto md:mt-8">
      <div className="w-full">
        <ProfileHero profile={currentUser} />
      </div>

      {/* Section des projets pinnés */}
      <div className="mt-12 mb-8 flex w-full">
        <PinnedProjects profile={currentUser} />
      </div>

      {/* Section des candidatures reçues */}
    </div>
  );
}
