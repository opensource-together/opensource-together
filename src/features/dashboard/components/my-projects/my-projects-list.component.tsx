"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { HiMiniSquare2Stack, HiPlus } from "react-icons/hi2";
import { toast } from "sonner";
import { profileKeys } from "@/features/profile/hooks/profile.keys";
import {
  useDeleteProjectMutation,
  useToggleProjectPublishedMutation,
} from "@/features/projects/hooks/project.mutations";
import type { Project } from "@/features/projects/types/project.type";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { DataTablePagination } from "@/shared/components/ui/data-table-pagination.component";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { ErrorState } from "@/shared/components/ui/error-state";
import { PaginationInfo } from "@/shared/components/ui/pagination-info.component";
import { Table, TableBody } from "@/shared/components/ui/table";
import { getErrorMessage } from "@/shared/lib/get-error-message";

import { useMyProjectsQuery } from "../../hooks/my-projects.queries";
import type { ProjectQueryParams } from "../../services/my-projects.service";
import MyProjectsSkeleton from "../skeletons/my-projects-skeleton.component";
import MyProjectRow from "./my-projects-row.component";

const parseNumber = (value: string | null, fallback: number) => {
  if (!value) return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export default function MyProjectsList() {
  const searchParams = useSearchParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [togglingProjectId, setTogglingProjectId] = useState<string | null>(
    null
  );

  const page = parseNumber(searchParams.get("page"), 1);
  const perPage = parseNumber(searchParams.get("per_page"), 7);
  const queryParams: ProjectQueryParams = { page, per_page: perPage };

  const {
    data: myProjectsResponse,
    isLoading,
    isError,
  } = useMyProjectsQuery(queryParams);

  const deleteProjectMutation = useDeleteProjectMutation();
  const toggleProjectPublishedMutation = useToggleProjectPublishedMutation();

  const myProjects = myProjectsResponse?.data || [];
  const pagination = myProjectsResponse?.pagination;

  const handleDeleteClick = (project: { id: string; title: string }) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete?.id) return;

    try {
      await deleteProjectMutation.mutateAsync({
        projectId: projectToDelete.id,
      });
      toast.success("Project deleted successfully");
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Error while deleting project"));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const handleTogglePublish = async (project: Project) => {
    if (!project.id) return;

    setTogglingProjectId(project.id);
    try {
      await toggleProjectPublishedMutation.mutateAsync({
        project,
        published: !project.published,
      });
      toast.success("Project visibility updated");
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Failed to update project visibility")
      );
    } finally {
      setTogglingProjectId((current) =>
        current === project.id ? null : current
      );
    }
  };

  if (isLoading) return <MyProjectsSkeleton />;

  if (isError)
    return (
      <ErrorState
        message="Failed to fetch projects"
        queryKey={profileKeys.projects("me")}
      />
    );

  if (myProjects.length === 0) {
    return (
      <EmptyState
        icon={HiMiniSquare2Stack}
        title="No projects"
        description="Create a new project to get started"
        buttonText="Create a project"
        href="/projects/create"
        buttonIcon={HiPlus}
      />
    );
  }

  return (
    <div>
      <Table className="border-separate border-spacing-0">
        <TableBody className="[&_tr]:border-0">
          {myProjects.map((project) => (
            <MyProjectRow
              key={project.id}
              project={project}
              onTogglePublish={handleTogglePublish}
              onDelete={handleDeleteClick}
              isTogglingPublished={toggleProjectPublishedMutation.isPending}
              togglingProjectId={togglingProjectId}
            />
          ))}
        </TableBody>
      </Table>

      {pagination && (
        <div className="mt-4 flex items-center justify-between">
          <PaginationInfo pagination={pagination} />
          <DataTablePagination pagination={pagination} />
        </div>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete project"
        description={`Are you sure you want to delete the project "${projectToDelete?.title}" ? This action is irreversible.`}
        isLoading={deleteProjectMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmText="Delete Project"
        confirmVariant="destructive"
      />
    </div>
  );
}
