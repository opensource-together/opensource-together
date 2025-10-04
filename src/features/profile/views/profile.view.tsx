"use client";

import TwoColumnLayout from "@/shared/components/layout/two-column-layout.component";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

import useAuth from "@/features/auth/hooks/use-auth.hook";

import ProfileError from "../components/error-ui/profile-error.component";
import GithubGraph from "../components/github-graph.component";
import PinnedProjects from "../components/pinned-projects.component";
import ProfileHero, {
  ProfileMobileHero,
} from "../components/profile-hero.component";
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
      hero={<ProfileHero profile={currentUser} hideHeader={false} />}
      mobileHeader={<ProfileMobileHero profile={currentUser} />}
    >
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
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
            <PinnedProjects profile={currentUser} />
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
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
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <div className="flex w-full">
            <PinnedProjects profile={currentUser} />
          </div>
        </TabsContent>
      </Tabs>
    </TwoColumnLayout>
  );
}
