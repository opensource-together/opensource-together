"use client";

import TwoColumnLayout from "@/shared/components/layout/two-column-layout.component";

import useAuth from "@/features/auth/hooks/use-auth.hook";

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
  const { currentUser, isLoading: isAuthLoading } = useAuth();

  const isMaintainer = !isAuthLoading && currentUser?.id === project?.owner?.id;

  if (isLoading) return <SkeletonProjectDetail />;
  if (isError || !project) return <ProjectDetailContentError />;

  return (
    <TwoColumnLayout
      sidebar={
        <ProjectSideBar
          project={project}
          isMaintainer={isMaintainer}
          isAuthLoading={isAuthLoading}
        />
      }
      hero={<ProjectHero project={project} />}
      mobileHeader={<ProjectMobileHero {...project} />}
    ></TwoColumnLayout>
  );
}
