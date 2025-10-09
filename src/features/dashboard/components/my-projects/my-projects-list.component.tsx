"use client";

import { useRouter } from "next/navigation";
import { HiMiniSquare2Stack } from "react-icons/hi2";

import { Avatar } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Icon } from "@/shared/components/ui/icon";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/components/ui/table";

import { useMyProjects } from "../../hooks/use-my-projects.hook";

export default function MyProjectsList() {
  const { data: projects = [] } = useMyProjects();
  const router = useRouter();
  if (projects.length === 0) {
    return (
      <EmptyState
        icon={HiMiniSquare2Stack}
        text="No projects have been created"
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
                onClick={() =>
                  router.push(`/dashboard/my-projects/${project.id}`)
                }
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={project.image}
                      name={project.title}
                      alt={project.title}
                      size="md"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{project.title}</h4>
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center">
                    {project.teamMembers?.length === 0 ? (
                      <span className="text-muted-foreground text-sm text-nowrap">
                        No member
                      </span>
                    ) : (
                      <>
                        <span className="mr-1 text-sm font-medium">
                          {project.teamMembers?.length}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          Member{project.teamMembers?.length > 1 ? "s" : ""}
                        </span>
                      </>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-sm font-medium">
                    {new Date(project.createdAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </TableCell>

                <TableCell>
                  <Button variant="outline" size="icon">
                    <Icon name="trash" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
