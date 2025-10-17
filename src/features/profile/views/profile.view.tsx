"use client";

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
import ProfileHero, {
  ProfileMobileHero,
} from "../components/profile-hero.component";
import ProfileProjectsList from "../components/profile-projects-list";
import ProfileSidebar from "../components/profile-sidebar.component";
import RecentProjects from "../components/recent-projects.component";
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
        queryKey={["user/me"]}
        className="mt-20 mb-28"
        buttonText="Back to homepage"
        href="/"
      />
    );

  const shouldShowGithubCalendar = currentUser.provider !== "google";

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
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {shouldShowGithubCalendar && (
            <div className="mb-2 w-full">
              <GithubGraph
                contributionGraph={currentUser.contributionGraph}
                contributionsCount={
                  currentUser.contributionGraph?.totalContributions || 0
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
            <ProfileProjectsList />
          </div>
        </TabsContent>

        <TabsContent value="contributions" className="mt-6">
          {shouldShowGithubCalendar && (
            <div className="mb-2 w-full">
              <GithubGraph
                contributionGraph={currentUser.contributionGraph}
                contributionsCount={
                  currentUser.contributionGraph?.totalContributions || 0
                }
              />
            </div>
          )}
          <div className="mt-12 w-full">
            {tab === "contributions" && <ProfilePullRequests />}
          </div>
        </TabsContent>
      </Tabs>
    </TwoColumnLayout>
  );
}
