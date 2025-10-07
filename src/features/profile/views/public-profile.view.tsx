"use client";

import TwoColumnLayout from "@/shared/components/layout/two-column-layout.component";
import { ErrorState } from "@/shared/components/ui/error-state";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

import GithubGraph from "../components/github-graph.component";
import PinnedProjects from "../components/pinned-projects.component";
import ProfileHero, {
  ProfileMobileHero,
} from "../components/profile-hero.component";
import ProfileSidebar from "../components/profile-sidebar.component";
import SkeletonProfileView from "../components/skeletons/skeleton-profile-view.component";
import { useProfile } from "../hooks/use-profile.hook";

interface PublicProfileViewProps {
  userId: string;
}

export function PublicProfileView({ userId }: PublicProfileViewProps) {
  const { data: profile, isLoading, isError } = useProfile(userId);

  if (isLoading) return <SkeletonProfileView />;
  if (isError || !profile)
    return (
      <ErrorState
        message="An error has occurred while loading the profile. Please try again later."
        queryKey={["user", userId]}
        className="mt-20 mb-28"
        buttonText="Back to projects"
        href="/"
      />
    );

  const shouldShowGithubData = profile.provider !== "google";

  return (
    <TwoColumnLayout
      sidebar={<ProfileSidebar profile={profile} />}
      hero={
        <ProfileHero profile={profile} variant="public" hideHeader={false} />
      }
      mobileHeader={<ProfileMobileHero profile={profile} />}
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
              <GithubGraph
                contributionGraph={profile.contributionGraph}
                contributionsCount={
                  profile.contributionGraph?.totalContributions || 0
                }
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
              <GithubGraph
                contributionGraph={profile.contributionGraph}
                contributionsCount={
                  profile.contributionGraph?.totalContributions || 0
                }
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
