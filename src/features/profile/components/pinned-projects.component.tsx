import { useState } from "react";
import { HiMiniSquare2Stack } from "react-icons/hi2";
import { useMyProjects } from "@/features/dashboard/hooks/use-my-projects.hook";
import type { Project } from "@/features/projects/types/project.type";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { ErrorState } from "@/shared/components/ui/error-state";
import { useProjectRepositorySummary } from "@/shared/hooks/use-git-repo-summary.hook";

import { useUserProjects } from "../hooks/use-profile.hook";
import PinProjectsModal from "./pin-projects-modal.component";
import PinnedProjectCard from "./pinned-project-card.component";
import ProfileProjectsSkeleton from "./skeletons/profile-projects-skeleton.component";

function PinnedProjectItem({ project }: { project: Project }) {
  const { data: repoSummary, isLoading } = useProjectRepositorySummary(
    project.publicId || project.id
  );

  const repositoryDetails = {
    stars: repoSummary?.stars ?? project.repositoryDetails?.stars ?? 0,
    forksCount:
      repoSummary?.forksCount ?? project.repositoryDetails?.forksCount ?? 0,
    openIssuesCount:
      repoSummary?.openIssuesCount ??
      project.repositoryDetails?.openIssuesCount ??
      0,
  };

  return (
    <PinnedProjectCard
      project={project}
      repositoryDetails={repositoryDetails}
      isRepositoryLoading={isLoading}
    />
  );
}

interface PinnedProjectsProps {
  userId?: string;
}

export default function PinnedProjects({ userId }: PinnedProjectsProps) {
  // If userId is provided, use the user's projects endpoint, otherwise use "me"
  const effectiveUserId = userId || "me";
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);

  const {
    data: projectsResponse,
    isLoading,
    isError,
  } = useUserProjects(
    effectiveUserId,
    {
      page: 1,
      per_page: 3,
      published: true,
    },
    { enabled: !!effectiveUserId }
  );
  const myProjects = projectsResponse?.data || [];

  const { data: allProjectsResponse, isLoading: isLoadingAllProjects } =
    useMyProjects({
      published: true,
      per_page: 100,
      page: 1,
    });
  const allProjects = allProjectsResponse?.data || [];

  if (isLoading) return <ProfileProjectsSkeleton />;
  if (isError)
    return (
      <ErrorState
        message="Failed to fetch projects"
        queryKey={["user", effectiveUserId, "projects"]}
      />
    );

  const pinnedProjects = myProjects.slice(0, 3);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="mt-14 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="flex size-1.5 rounded-full bg-ost-blue-three"></span>
          <h2 className="text-muted-foreground">
            <span className="font-medium text-primary">
              {pinnedProjects.length}
            </span>{" "}
            {pinnedProjects.length === 1 ? "Pinned Project" : "Pinned Projects"}
          </h2>
        </div>
        <Button variant="outline" onClick={() => setIsPinModalOpen(true)}>
          Pin a Project
        </Button>
      </div>
      {pinnedProjects.length === 0 ? (
        <EmptyState
          title="No pinned projects"
          description="Pin your published projects to showcase them here."
          icon={HiMiniSquare2Stack}
        />
      ) : (
        pinnedProjects.map((project) => (
          <PinnedProjectItem key={project.id} project={project} />
        ))
      )}

      <PinProjectsModal
        open={isPinModalOpen}
        onOpenChange={setIsPinModalOpen}
        projects={allProjects}
        selectedProjectIds={selectedProjectIds}
        onSelectionChange={setSelectedProjectIds}
        isLoading={isLoadingAllProjects}
      />
    </div>
  );
}
