"use client";

import { Suspense } from "react";

import TwoColumnLayout from "@/shared/components/layout/two-column-layout.component";
import { ErrorState } from "@/shared/components/ui/error-state";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { useTabNavigation } from "@/shared/hooks/use-tab-navigation.hook";

import GithubGraph from "../components/github-graph.component";
import ProfileHero, {
  ProfileMobileHero,
} from "../components/profile-hero.component";
import ProfileProjectsList from "../components/profile-projects-list";
import ProfileSidebar from "../components/profile-sidebar.component";
import RecentProjects from "../components/recent-projects.component";
import ProfileProjectsSkeleton from "../components/skeletons/profile-projects-skeleton.component";
import { ProfilePullRequestsSkeleton } from "../components/skeletons/profile-pull-requests-skeleton.component";
import SkeletonProfileView from "../components/skeletons/skeleton-profile-view.component";
import { useProfile } from "../hooks/use-profile.hook";
import ProfilePullRequests from "./profile-pull-requests.view";

interface PublicProfileViewProps {
  userId: string;
}

export function PublicProfileView({ userId }: PublicProfileViewProps) {
  const { data: profile, isLoading, isError } = useProfile(userId);
  const { tab, handleTabChange } = useTabNavigation("overview");

  if (!profile && isLoading) {
    return <SkeletonProfileView />;
  }

  if (!profile && isError) {
    return (
      <ErrorState
        message="An error has occurred while loading the profile. Please try again later."
        queryKey={["user", userId]}
        className="mt-20 mb-28"
        buttonText="Back to projects"
        href="/"
      />
    );
  }

  if (!profile) return null;

  const shouldShowGithubData = profile.provider !== "google";

  return (
    <TwoColumnLayout
      sidebar={<ProfileSidebar profile={profile} />}
      hero={
        <ProfileHero profile={profile} variant="public" hideHeader={false} />
      }
      mobileHeader={<ProfileMobileHero profile={profile} />}
    >
      <Tabs defaultValue={tab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="pull-requests">Pull Requests</TabsTrigger>
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
            <RecentProjects />
          </div>
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <div className="flex w-full">
            <Suspense fallback={<ProfileProjectsSkeleton />}>
              <ProfileProjectsList />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="pull-requests" className="mt-6">
          <Suspense fallback={<ProfilePullRequestsSkeleton />}>
            <ProfilePullRequests userId={userId} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </TwoColumnLayout>
  );
}
