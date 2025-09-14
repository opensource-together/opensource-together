"use client";

import TwoColumnLayout from "@/shared/components/layout/two-column-layout.component";
import { EmptyState } from "@/shared/components/ui/empty-state";

import GithubCalendar from "../components/github-calendar.component";
import PinnedProjects from "../components/pinned-projects.component";
import ProfileExperience from "../components/profile-experience.component";
import ProfileSidebar from "../components/profile-sidebar.component";
import PublicProfileHero from "../components/public-profile-hero.component";
import SkeletonProfileView from "../components/skeletons/skeleton-profile-view.component";
import { useProfile } from "../hooks/use-profile.hook";

interface PublicProfileViewProps {
  userId: string;
}

export function PublicProfileView({ userId }: PublicProfileViewProps) {
  const { data: profile, isLoading, isError } = useProfile(userId);

  if (isLoading) return <SkeletonProfileView />;
  if (isError || !profile) {
    return (
      <>
        <EmptyState
          text="Profil non trouvé"
          buttonText="Retour à l'accueil"
          href="/"
        />
      </>
    );
  }

  const shouldShowGithubData = profile.provider !== "google";

  return (
    <TwoColumnLayout
      sidebar={<ProfileSidebar profile={profile} />}
      hero={<PublicProfileHero profile={profile} />}
    >
      {shouldShowGithubData && (
        <div className="mb-2 w-full">
          <GithubCalendar
            contributionGraph={profile.githubStats?.contributionGraph}
            contributionsCount={profile.githubStats?.commitsThisYear || 0}
          />
        </div>
      )}

      <div className="w-full">
        <ProfileExperience />
      </div>

      <div className="mt-12 mb-8 flex w-full">
        <PinnedProjects profile={profile} />
      </div>
    </TwoColumnLayout>
  );
}
