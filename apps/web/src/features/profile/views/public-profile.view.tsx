"use client";

import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
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
          title="Profil non trouvé"
          description="L'utilisateur que vous recherchez n'existe pas ou n'est pas accessible. Il se peut que le profil ait été supprimé ou que l'URL soit incorrecte."
          action={
            <>
              <Link href="/">
                <Button>Retour à l'accueil</Button>
              </Link>
            </>
          }
        />
      </>
    );
  }

  const shouldShowGithubData = profile.provider !== "google";

  return (
    <>
      <div className="mx-4 mt-4 flex w-full max-w-7xl flex-col gap-2 md:mx-auto md:mt-8 lg:flex-row lg:justify-center">
        <div className="w-full lg:mr-35 lg:w-auto">
          <ProfileSidebar profile={profile} />
        </div>

        <div className="flex w-full flex-col items-center justify-center gap-5 lg:w-[639px]">
          <div className="w-full">
            <PublicProfileHero profile={profile} />
          </div>

          {shouldShowGithubData && (
            <div className="mb-8 w-full">
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
        </div>
      </div>
    </>
  );
}
