"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import TwoColumnLayout from "@/shared/components/layout/two-column-layout.component";
import { ErrorState } from "@/shared/components/ui/error-state";
import ImageSlider from "@/shared/components/ui/image-slider.component";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

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
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const tab = searchParams.get("tab") || "overview";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "overview") params.delete("tab");
    else params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`);
  };

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
          <TabsTrigger value="projects">Open Issues</TabsTrigger>
          <TabsTrigger value="pull-requests">Pull Requests</TabsTrigger>
          <TabsTrigger value="contributions">Contributors</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {project.imagesUrls.length > 0 && (
            <ImageSlider images={project.imagesUrls} />
          )}

          {project.readme && (
            <ProjectReadme
              readme={project.readme}
              projectTitle={project.title}
              project={{
                githubUrl: project.githubUrl,
                gitlabUrl: project.gitlabUrl,
              }}
            />
          )}
          {/* TODO: Add open recent issues card here */}
        </TabsContent>
      </Tabs>
    </TwoColumnLayout>
  );
}
