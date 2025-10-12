"use client";

import TwoColumnLayout from "@/shared/components/layout/two-column-layout.component";

import ProjectDetailContentError from "../components/error-ui/project-detail-content-error.component";
import ProjectHero, {
  ProjectMobileHero,
} from "../components/project-hero.component";
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

  if (isLoading) return <SkeletonProjectDetail />;
  if (isError || !project) return <ProjectDetailContentError />;

  return (
    <TwoColumnLayout
      sidebar={<ProjectSideBar project={project} />}
      hero={<ProjectHero project={project} />}
      mobileHeader={<ProjectMobileHero {...project} />}
    ></TwoColumnLayout>
  );
}
