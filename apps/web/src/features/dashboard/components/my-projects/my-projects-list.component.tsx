"use client";

import { useRouter } from "next/navigation";

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
        title="Aucun projet"
        description="Vous n'avez pas de projets. Créez un projet pour commencer."
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
                    {project.applications.length === 0 ? (
                      <span className="text-muted-foreground text-sm">
                        Aucun candidat
                      </span>
                    ) : (
                      <>
                        <span className="bg-ost-blue-three mr-1 inline-block size-2 rounded-full" />
                        <span className="mr-1 text-sm font-medium">
                          {project.applications.length}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          Nouveau candidat
                          {project.applications.length > 1 ? "s" : ""}
                        </span>
                      </>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center">
                    {project.teamMembers.length === 0 ? (
                      <span className="text-muted-foreground text-sm">
                        Aucun membre
                      </span>
                    ) : (
                      <>
                        <span className="mr-1 text-sm font-medium">
                          {project.teamMembers.length}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          Membre{project.teamMembers.length > 1 ? "s" : ""}
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
