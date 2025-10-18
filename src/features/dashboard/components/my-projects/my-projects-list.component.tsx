"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  HiMiniEllipsisVertical,
  HiMiniPencilSquare,
  HiMiniSquare2Stack,
  HiMiniTrash,
  HiPlus,
} from "react-icons/hi2";

import { Avatar } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
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
import { formatTimeAgo } from "@/shared/lib/utils/format-time-ago";

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

  const page = parseNumber(searchParams.get("page"), 1);
  const perPage = parseNumber(searchParams.get("per_page"), 7);
  const queryParams: ProjectQueryParams = { page, per_page: perPage };

  const {
    data: myProjectsResponse,
    isLoading,
    isError,
  } = useMyProjects(queryParams);

  const myProjects = myProjectsResponse?.data || [];
  const pagination = myProjectsResponse?.pagination;

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
                  <span className="text-sm font-medium">
                    {formatTimeAgo(project.createdAt)}
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
                      <DropdownMenuItem className="text-destructive flex items-center justify-between">
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
    </div>
  );
}
