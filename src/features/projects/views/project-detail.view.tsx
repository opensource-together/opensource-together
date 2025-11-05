"use client";

import { HiMiniExclamationTriangle, HiUsers } from "react-icons/hi2";

import TwoColumnLayout from "@/shared/components/layout/two-column-layout.component";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { ErrorState } from "@/shared/components/ui/error-state";
import ImageSlider from "@/shared/components/ui/image-slider.component";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { useTabNavigation } from "@/shared/hooks/use-tab-navigation.hook";

import ContributingComponent from "../components/contributing.component";
import ContributorsList from "../components/contributors-list.component";
import OpenIssuesList from "../components/issues/open-issues-list";
import RecentOpenIssues from "../components/issues/recent-opent-issues";
import ProjectCodeOfConduct from "../components/project-code-of-conduct.component";
import ProjectHero, {
  ProjectMobileHero,
} from "../components/project-hero.component";
import ProjectPullRequestList from "../components/project-pull-request-list.component";
import ProjectReadme from "../components/project-readme.component";
import ProjectSideBar from "../components/project-side-bar.component";
import SkeletonProjectDetail from "../components/skeletons/skeleton-project-detail.component";
import { useDecodedFiles } from "../hooks/use-decoded-files.hook";
import { useProject } from "../hooks/use-projects.hook";

interface ProjectDetailViewProps {
  projectId: string;
}

export default function ProjectDetailView({
  projectId,
}: ProjectDetailViewProps) {
  const { data: project, isLoading, isError } = useProject(projectId);
  const { tab, handleTabChange } = useTabNavigation("overview");
  const { readme, contributionFile, codeOfConduct } = useDecodedFiles(project);

  if (!project && isLoading) {
    return <SkeletonProjectDetail />;
  }

  if (!project && isError) {
    return (
      <ErrorState
        message="An error has occurred while loading the project. Please try again later."
        queryKey={["project", projectId]}
        className="mt-20 mb-28"
        buttonText="Back to homepage"
        href="/projects"
      />
    );
  }

  if (!project) return null;

  return (
    <TwoColumnLayout
      sidebar={<ProjectSideBar project={project} />}
      hero={<ProjectHero project={project} />}
      mobileHeader={<ProjectMobileHero project={project} />}
    >
      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contributing">Contributing</TabsTrigger>
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
          {(() => {
            if (
              project.imagesUrls.length === 0 &&
              !readme &&
              (!project.repositoryDetails?.issues ||
                project.repositoryDetails.issues.length === 0)
            ) {
              return (
                <EmptyState
                  title="No data available"
                  description="This project has no overview data available."
                  icon={HiMiniExclamationTriangle}
                />
              );
            }

            return (
              <>
                {project.imagesUrls.length > 0 && (
                  <ImageSlider images={project.imagesUrls} />
                )}
                {readme && (
                  <ProjectReadme
                    readme={readme}
                    projectTitle={project.title}
                    project={{
                      repoUrl: project.repoUrl,
                    }}
                  />
                )}
                <RecentOpenIssues
                  issues={project.repositoryDetails?.issues || []}
                  projectId={projectId}
                />
              </>
            );
          })()}
        </TabsContent>

        <TabsContent value="contributing" className="mt-6">
          {(() => {
            if (!contributionFile && !codeOfConduct) {
              return (
                <EmptyState
                  title="No guidelines"
                  description="This project does not have a CONTRIBUTING.md or Code of Conduct file."
                  icon={HiUsers}
                />
              );
            }

            return (
              <>
                {contributionFile && (
                  <ContributingComponent contributionFile={contributionFile} />
                )}
                {codeOfConduct && (
                  <ProjectCodeOfConduct
                    codeOfConduct={codeOfConduct}
                    projectTitle={project.title}
                    project={{
                      repoUrl: project.repoUrl,
                    }}
                  />
                )}
              </>
            );
          })()}
        </TabsContent>

        <TabsContent value="open-issues" className="mt-6">
          <OpenIssuesList
            issues={project.repositoryDetails?.issues || []}
            projectId={projectId}
          />
        </TabsContent>

        <TabsContent value="pull-requests" className="mt-6">
          <ProjectPullRequestList
            pullRequests={project.repositoryDetails?.pullRequests || []}
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
