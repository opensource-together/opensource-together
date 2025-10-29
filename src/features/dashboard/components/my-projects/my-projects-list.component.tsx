"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { HiMiniSquare2Stack, HiPlus } from "react-icons/hi2";

import { Avatar } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { DataTablePagination } from "@/shared/components/ui/data-table-pagination.component";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { ErrorState } from "@/shared/components/ui/error-state";
import { PaginationInfo } from "@/shared/components/ui/pagination-info.component";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/components/ui/table";
import { formatNumberShort } from "@/shared/lib/utils/format-number";

import {
  useDeleteProject,
  useToggleProjectPublished,
} from "@/features/projects/hooks/use-projects.hook";
import { Project } from "@/features/projects/types/project.type";

import { useMyProjects } from "../../hooks/use-my-projects.hook";
import { ProjectQueryParams } from "../../services/my-projects.service";
import MyProjectsSkeleton from "../skeletons/my-projects-skeleton.component";
import { ProjectActions } from "./project-table-actions.component";

const parseNumber = (value: string | null, fallback: number) => {
  if (!value) return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export default function MyProjectsList() {
  const searchParams = useSearchParams();
  const router = useRouter();
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
          {myProjects.map((project) => {
            return (
              <TableRow
                key={project.id}
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={project.logoUrl}
                      name={project.title}
                      alt={project.title}
                      size="md"
                      shape="soft"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{project.title}</h4>
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-ost-blue-three flex size-1.5 rounded-full"></span>
                    <h2 className="text-muted-foreground text-sm">
                      <span className="text-primary font-medium">
                        {formatNumberShort(
                          project.repositoryDetails?.openIssuesCount
                        )}
                      </span>{" "}
                      {project.repositoryDetails?.openIssuesCount > 1
                        ? "Open Issues"
                        : "Open Issue"}
                    </h2>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant={project.published ? "info" : "gray"}>
                    {project.published ? "Published" : "Unpublished"}
                  </Badge>
                </TableCell>

                <TableCell>
                  <span className="text-sm font-medium">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </TableCell>

                <TableCell>
                  <ProjectActions
                    project={project}
                    onTogglePublish={handleTogglePublish}
                    onDelete={handleDeleteClick}
                    isTogglingPublished={isTogglingPublished}
                    togglingProjectId={togglingProjectId}
                  />
                </TableCell>
              </TableRow>
            );
          })}
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
