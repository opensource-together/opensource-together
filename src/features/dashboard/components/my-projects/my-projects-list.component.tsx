"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  HiMiniEllipsisVertical,
  HiMiniPencilSquare,
  HiMiniSquare2Stack,
  HiMiniTrash,
  HiPlus,
} from "react-icons/hi2";

import { Avatar } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { DataTablePagination } from "@/shared/components/ui/data-table-pagination.component";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { ErrorState } from "@/shared/components/ui/error-state";
import { PaginationInfo } from "@/shared/components/ui/pagination-info.component";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/components/ui/table";

import { useDeleteProject } from "@/features/projects/hooks/use-projects.hook";

import { useMyProjects } from "../../hooks/use-my-projects.hook";
import { ProjectQueryParams } from "../../services/my-projects.service";
import MyProjectsSkeleton from "../skeletons/my-projects-skeleton.component";

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

  const page = parseNumber(searchParams.get("page"), 1);
  const perPage = parseNumber(searchParams.get("per_page"), 7);
  const queryParams: ProjectQueryParams = { page, per_page: perPage };

  const {
    data: myProjectsResponse,
    isLoading,
    isError,
  } = useMyProjects(queryParams);

  const { deleteProject, isDeleting } = useDeleteProject();

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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <HiMiniEllipsisVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/projects/${project.id}/edit`);
                        }}
                        className="flex items-center justify-between"
                      >
                        Edit Project
                        <HiMiniPencilSquare className="size-4" />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick({
                            id: project.id ?? "",
                            title: project.title || "Untitled Project",
                          });
                        }}
                        className="text-destructive flex items-center justify-between"
                      >
                        Delete Project
                        <HiMiniTrash className="text-destructive size-4" />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
