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

import useAuth from "@/features/auth/hooks/use-auth.hook";

import GithubGraph from "../components/github-graph.component";
import ProfileExperiences from "../components/profile-experiences.component";
import ProfileHero, {
  ProfileMobileHero,
} from "../components/profile-hero.component";
import ProfileProjectsList from "../components/profile-projects-list";
import ProfileSidebar from "../components/profile-sidebar.component";
import RecentProjects from "../components/recent-projects.component";
import ProfileProjectsSkeleton from "../components/skeletons/profile-projects-skeleton.component";
import { ProfilePullRequestsSkeleton } from "../components/skeletons/profile-pull-requests-skeleton.component";
import SkeletonProfileView from "../components/skeletons/skeleton-profile-view.component";
import ProfilePullRequests from "./profile-pull-requests.view";

export default function ProfileView() {
  const { currentUser, isLoading, isError } = useAuth();
  const { tab, handleTabChange } = useTabNavigation("overview");

  if (isLoading) return <SkeletonProfileView />;
  if (isError || !currentUser)
    return (
      <ErrorState
        message="An error has occurred while loading the profile. Please try again later."
        queryKey={["users", "me"]}
        className="mt-20 mb-28"
        buttonText="Back to homepage"
        href="/"
      />
    );

  return (
    <TwoColumnLayout
      sidebar={<ProfileSidebar profile={currentUser} />}
      hero={<ProfileHero profile={currentUser} hideHeader={false} />}
      mobileHeader={<ProfileMobileHero profile={currentUser} />}
    >
      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="pull-request">Pull Requests</TabsTrigger>
          <TabsTrigger value="saved-projects">Saved Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="mb-2 w-full">
            <GithubGraph
              contributionGraph={currentUser.contributionGraph}
              contributionsCount={
                currentUser.contributionGraph?.totalContributions || 0
              }
            />
          </div>

          <ProfileExperiences experiences={currentUser.userExperiences} />
          <RecentProjects />
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <Suspense fallback={<ProfileProjectsSkeleton />}>
            <ProfileProjectsList userId={currentUser.id} />
          </Suspense>
        </TabsContent>

        <TabsContent value="pull-request" className="mt-6">
          <Suspense fallback={<ProfilePullRequestsSkeleton />}>
            <ProfilePullRequests />
          </Suspense>
        </TabsContent>
        <TabsContent value="saved-projects" className="mt-6">
          {/* TODO: Implement saved projects list */}
        </TabsContent>
      </Tabs>
    </TwoColumnLayout>
  );
}
