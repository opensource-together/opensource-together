"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { HiMiniSquare2Stack, HiPlus } from "react-icons/hi2";

import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { DataTablePagination } from "@/shared/components/ui/data-table-pagination.component";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { ErrorState } from "@/shared/components/ui/error-state";
import { PaginationInfo } from "@/shared/components/ui/pagination-info.component";
import { Table, TableBody } from "@/shared/components/ui/table";

import {
  useDeleteProject,
  useToggleProjectPublished,
} from "@/features/projects/hooks/use-projects.hook";
import { Project } from "@/features/projects/types/project.type";

import { useMyProjects } from "../../hooks/use-my-projects.hook";
import { ProjectQueryParams } from "../../services/my-projects.service";
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
  } = useMyProjects(queryParams);

  const { deleteProject, isDeleting } = useDeleteProject();
  const { toggleProjectPublished, isTogglingPublished } =
    useToggleProjectPublished();

  const myProjects = myProjectsResponse?.data || [];
  const pagination = myProjectsResponse?.pagination;

  const handleDeleteClick = (project: { id: string; title: string }) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete?.id) {
      deleteProject(projectToDelete.id);
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const handleTogglePublish = (project: Project) => {
    if (!project.id) return;

    setTogglingProjectId(project.id);
    toggleProjectPublished(
      { project, published: !project.published },
      {
        onSettled: () => {
          setTogglingProjectId((current) =>
            current === project.id ? null : current
          );
        },
      }
    );
  };

  if (isLoading) return <MyProjectsSkeleton />;

  if (isError)
    return (
      <ErrorState
        message="Failed to fetch projects"
        queryKey={["user", "me", "projects"]}
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
      <Table>
        <TableBody>
          {myProjects.map((project) => (
            <MyProjectRow
              key={project.id}
              project={project}
              onTogglePublish={handleTogglePublish}
              onDelete={handleDeleteClick}
              isTogglingPublished={isTogglingPublished}
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
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmText="Delete Project"
        confirmVariant="destructive"
      />
    </div>
  );
}
