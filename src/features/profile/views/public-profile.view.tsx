"use client";

import TwoColumnLayout from "@/shared/components/layout/two-column-layout.component";
import { EmptyState } from "@/shared/components/ui/empty-state";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

import GithubCalendar from "../components/github-calendar.component";
import PinnedProjects from "../components/pinned-projects.component";
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
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {shouldShowGithubData && (
            <div className="mb-2 w-full">
              <GithubCalendar
                contributionGraph={profile.githubStats?.contributionGraph}
                contributionsCount={profile.githubStats?.commitsThisYear || 0}
              />
            </div>
          )}

          <div className="mt-12 flex w-full">
            <PinnedProjects profile={profile} />
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          {shouldShowGithubData && (
            <div className="mb-2 w-full">
              <GithubCalendar
                contributionGraph={profile.githubStats?.contributionGraph}
                contributionsCount={profile.githubStats?.commitsThisYear || 0}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <div className="flex w-full">
            <PinnedProjects profile={profile} />
          </div>
        </TabsContent>
      </Tabs>
    </TwoColumnLayout>
  );
}
