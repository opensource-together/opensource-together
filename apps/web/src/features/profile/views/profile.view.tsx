"use client";

import TwoColumnLayout from "@/shared/components/layout/two-column-layout.component";

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

  const shouldShowGithubCalendar = currentUser.provider !== "google";

  return (
    <TwoColumnLayout
      sidebar={<ProfileSidebar profile={currentUser} />}
      hero={<ProfileHero profile={currentUser} />}
    >
      {shouldShowGithubCalendar && (
        <div className="mb-8 w-full">
          <GithubCalendar
            contributionGraph={currentUser.githubStats?.contributionGraph}
            contributionsCount={currentUser.githubStats?.commitsThisYear || 0}
          />
        </div>
      )}

      <div className="w-full">
        <ProfileExperience />
      </div>

      <div className="mt-12 mb-8 flex w-full">
        <PinnedProjects profile={currentUser} />
      </div>
    </TwoColumnLayout>
  );
}
