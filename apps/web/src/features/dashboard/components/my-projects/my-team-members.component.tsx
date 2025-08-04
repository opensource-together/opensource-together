"use client";

import { EllipsisVertical } from "lucide-react";

import { Avatar } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Icon } from "@/shared/components/ui/icon";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/components/ui/table";

import { TeamMemberType } from "../../types/my-projects.type";

interface MyTeamMembersProps {
  members: TeamMemberType[];
}

export default function MyTeamMembers({ members }: MyTeamMembersProps) {
  if (members.length === 0) {
    return (
      <EmptyState
        title="Aucun membre dans l'équipe"
        description="Votre projet n'a pas encore de membres."
      />
    );
  }

  return (
    <div className="rounded-lg border border-black/10">
      <Table>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar
                    src={member.avatarUrl}
                    name={member.name}
                    alt={member.name}
                    size="md"
                  />
                  <div className="flex flex-col">
                    <h4 className="font-medium tracking-tighter">
                      {member.name}
                    </h4>
                    {member.techStacks && member.techStacks.length > 0 && (
                      <div className="mt-1 flex items-center">
                        <div className="flex gap-1">
                          {member.techStacks.slice(0, 3).map((tech) => (
                            <Badge
                              variant="outline"
                              key={tech.id}
                              className="text-xs"
                            >
                              {tech.name}
                            </Badge>
                          ))}
                        </div>
                        {member.techStacks.length > 3 && (
                          <span className="ml-1 flex h-5.5 flex-shrink-0 items-center rounded-full bg-transparent text-xs whitespace-nowrap text-black/20">
                            +{member.techStacks.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-xs text-black/50">Rôle</span>
                  <span className="text-sm font-medium tracking-tighter">
                    {member.role}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-xs text-black/50">Rejoint le</span>
                  <span className="text-sm font-medium tracking-tighter">
                    {member.joinedAt.toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-1 px-2"
                    >
                      <EllipsisVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2">
                    <DropdownMenuItem>
                      <div className="flex w-full items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">Voir profil</span>
                          <p className="text-xs text-gray-500">
                            Voir le profil du membre
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="user" size="sm" variant="gray" />
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div className="flex w-full items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">Retirer du projet</span>
                          <p className="text-xs text-gray-500">
                            Retirer le membre du projet
                          </p>
                        </div>
                        <Icon name="bagpack" size="sm" />
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
