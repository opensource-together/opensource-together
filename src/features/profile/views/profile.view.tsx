"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import TwoColumnLayout from "@/shared/components/layout/two-column-layout.component";
import { ErrorState } from "@/shared/components/ui/error-state";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

import useAuth from "@/features/auth/hooks/use-auth.hook";

import GithubGraph from "../components/github-graph.component";
import PinnedProjects from "../components/pinned-projects.component";
import ProfileHero, {
  ProfileMobileHero,
} from "../components/profile-hero.component";
import ProfileSidebar from "../components/profile-sidebar.component";
import SkeletonProfileView from "../components/skeletons/skeleton-profile-view.component";
import ProfilePullRequests from "./profile-pull-requests.view";

export default function ProfileView() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isLoading, isError } = useAuth();

  if (isLoading) return <SkeletonProfileView />;
  if (isError || !currentUser)
    return (
      <ErrorState
        message="An error has occurred while loading the profile. Please try again later."
        queryKey={["user/me"]}
        className="mt-20 mb-28"
        buttonText="Back to projects"
        href="/"
      />
    );

  const shouldShowGithubCalendar = currentUser.provider !== "google";

  const tab = searchParams.get("tab") || "overview";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "overview") params.delete("tab");
    else params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`);
  };

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
            <PinnedProjects profile={currentUser} />
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

        <TabsContent value="projects" className="mt-6">
          <div className="flex w-full">
            <PinnedProjects profile={currentUser} />
          </div>
        </TabsContent>
      </Tabs>
    </TwoColumnLayout>
  );
}
