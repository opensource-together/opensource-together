"use client";

import { useMemo } from "react";

import TwoColumnLayout from "@/shared/components/layout/two-column-layout.component";
import { ErrorState } from "@/shared/components/ui/error-state";
import ImageSlider from "@/shared/components/ui/image-slider.component";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { useTabNavigation } from "@/shared/hooks/use-tab-navigation.hook";
import { decodeBase64Safe } from "@/shared/lib/utils/decode-base-64";

import ContributorsList from "../components/contributors-list";
import OpenIssuesList from "../components/open-issues-list";
import OpenRecentIssues from "../components/open-recent-issues";
import ProjectHero, {
  ProjectMobileHero,
} from "../components/project-hero.component";
import ProjectReadme from "../components/project-readme.component";
import ProjectSideBar from "../components/project-side-bar.component";
import SkeletonProjectDetail from "../components/skeletons/skeleton-project-detail.component";
import { useProject } from "../hooks/use-projects.hook";

interface ProjectDetailViewProps {
  projectId: string;
}

export default function ProjectDetailView({
  projectId,
}: ProjectDetailViewProps) {
  const { data: project, isLoading, isError } = useProject(projectId);
  const { tab, handleTabChange } = useTabNavigation("overview");

  const sourceReadme = project?.repositoryDetails?.readme ?? undefined;
  const decodedReadme = useMemo(
    () =>
      sourceReadme
        ? (decodeBase64Safe(sourceReadme) ?? sourceReadme)
        : undefined,
    [sourceReadme]
  );

  if (isLoading) return <SkeletonProjectDetail />;
  if (isError || !project)
    return (
      <ErrorState
        message="An error has occurred while loading the project. Please try again later."
        queryKey={["project", projectId]}
        className="mt-20 mb-28"
        buttonText="Back to homepage"
        href="/projects"
      />
    );
  return (
    <TwoColumnLayout
      sidebar={<ProjectSideBar project={project} />}
      hero={<ProjectHero project={project} />}
      mobileHeader={<ProjectMobileHero {...project} />}
    >
      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger
            value="open-issues"
            count={project.repositoryDetails?.openIssuesCount}
          >
            Open Issues
          </TabsTrigger>
          <TabsTrigger
            value="pull-requests"
            count={project.repositoryDetails?.pullRequestsCount}
          >
            Pull Requests
          </TabsTrigger>
          <TabsTrigger
            value="contributions"
            count={(() => {
              const n = project.repositoryDetails?.contributors?.length ?? 0;
              return n > 99 ? "99+" : n;
            })()}
          >
            Contributors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {project.imagesUrls.length > 0 && (
            <ImageSlider images={project.imagesUrls} />
          )}
          {decodedReadme && (
            <ProjectReadme
              readme={decodedReadme}
              projectTitle={project.title}
              project={{
                repoUrl: project.repoUrl,
              }}
            />
          )}
          <OpenRecentIssues
            issues={project.repositoryDetails?.issues || []}
            projectId={projectId}
          />
        </TabsContent>

        <TabsContent value="open-issues" className="mt-6">
          <OpenIssuesList
            issues={project.repositoryDetails?.issues || []}
            projectId={projectId}
          />
        </TabsContent>
        <TabsContent value="contributions" className="mt-6">
          <ContributorsList
            contributors={project.repositoryDetails?.contributors || []}
          />
        </TabsContent>
      </Tabs>
    </TwoColumnLayout>
  );
}
