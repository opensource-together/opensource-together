"use client";

import useAuth from "@/features/auth/hooks/use-auth.hook";

import ProfileError from "../components/error-ui/profile-error.component";
import GithubCalendar from "../components/github-calendar.component";
import PinnedProjects from "../components/pinned-projects.component";
import ProfileExperience from "../components/profile-experience.component";
import ProfileHero from "../components/profile-hero.component";
import ProfileSidebar from "../components/profile-sidebar.component";
import SkeletonProfileView from "../components/skeletons/skeleton-profile-view.component";

export default function ProfileView() {
  const { currentUser, isLoading, isError } = useAuth();

  if (isLoading) return <SkeletonProfileView />;
  if (isError || !currentUser) return <ProfileError />;

  return (
    <div className="mx-4 mt-4 flex w-full max-w-7xl flex-col gap-2 md:mx-auto md:mt-8 lg:flex-row lg:justify-center">
      {/* Sidebar à gauche */}
      <div className="w-full lg:mr-35 lg:w-auto">
        <ProfileSidebar profile={currentUser} />
      </div>

      {/* Main Content à droite */}
      <div className="flex w-full flex-col items-center justify-center gap-5 lg:w-[639px]">
        <div className="w-full">
          <ProfileHero profile={currentUser} />
        </div>

        {/* Section du calendrier GitHub */}
        <div className="mb-8 w-full">
          <GithubCalendar
            contributionGraph={currentUser.githubStats?.contributionGraph}
            contributionsCount={currentUser.githubStats?.commitsThisYear || 0}
          />
        </div>

        {/* Section des expériences */}
        <div className="w-full">
          <ProfileExperience />
        </div>

        {/* Section des projets pinnés */}
        <div className="mt-12 mb-8 flex w-full">
          <PinnedProjects profile={currentUser} />
        </div>
      </div>
    </div>
  );
}
