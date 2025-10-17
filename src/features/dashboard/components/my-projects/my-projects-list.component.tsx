"use client";

import { useRouter } from "next/navigation";
import {
  HiMiniEllipsisVertical,
  HiMiniPencilSquare,
  HiMiniSquare2Stack,
  HiMiniTrash,
  HiPlus,
} from "react-icons/hi2";

import { Avatar } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { ErrorState } from "@/shared/components/ui/error-state";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/components/ui/table";
import { formatTimeAgo } from "@/shared/lib/utils/format-time-ago";

import { useMyProjects } from "../../hooks/use-my-projects.hook";
import MyProjectsSkeleton from "../skeletons/my-projects-skeleton.component";

export default function MyProjectsList() {
  const { data: projects = [], isLoading, isError } = useMyProjects();
  const router = useRouter();

  if (isLoading) return <MyProjectsSkeleton />;

  if (isError)
    return (
      <ErrorState
        message="Failed to fetch projects"
        queryKey={["user", "me", "projects"]}
      />
    );

  if (projects.length === 0) {
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
          {projects.map((project) => {
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
                      >
                        <HiMiniPencilSquare className="size-4" />
                        Edit Project
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <HiMiniTrash className="text-destructive size-4" />
                        Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
