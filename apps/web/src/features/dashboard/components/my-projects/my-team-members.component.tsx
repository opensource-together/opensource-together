"use client";

import { EllipsisVertical } from "lucide-react";
import Link from "next/link";

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
import MyTeamMembersSkeleton from "./skeletons/my-team-members-skeleton.component";

// Fonction utilitaire pour formater une date de manière sécurisée
const formatDate = (dateInput: Date | string): string => {
  try {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    return date.toLocaleDateString("fr-FR");
  } catch (error) {
    return "Date inconnue";
  }
};

interface MyTeamMembersProps {
  members: TeamMemberType[];
  isLoading?: boolean;
  projectOwnerId?: string;
  currentUserId?: string;
}

export default function MyTeamMembers({
  members,
  isLoading = false,
  projectOwnerId,
  currentUserId,
}: MyTeamMembersProps) {
  if (isLoading) {
    return <MyTeamMembersSkeleton />;
  }

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
          {members.map((member) => {
            const isOwner = projectOwnerId && member.id === projectOwnerId;
            const isCurrentUser = currentUserId && member.id === currentUserId;
            const isCurrentUserOwner =
              currentUserId &&
              projectOwnerId &&
              currentUserId === projectOwnerId;

            return (
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
                      <div className="flex items-center gap-1">
                        <h4 className="font-medium tracking-tighter">
                          {member.name}
                        </h4>
                        {isOwner && (
                          <Badge variant="danger">Propriétaire</Badge>
                        )}
                      </div>
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
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-black/50">Rôle</span>
                    <span className="text-sm font-medium">{member.role}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-black/50">Rejoint le</span>
                    <span className="text-sm font-medium">
                      {formatDate(member.joinedAt)}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 p-2">
                      <DropdownMenuItem>
                        <Link href={`/profile/${member.id}`} className="w-full">
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
                        </Link>
                      </DropdownMenuItem>

                      {/* L'owner peut retirer des membres (sauf lui-même) */}
                      {isCurrentUserOwner && !isCurrentUser && (
                        <DropdownMenuItem>
                          <div className="flex w-full items-center justify-between">
                            <div className="flex flex-col gap-1">
                              <span className="font-medium">
                                Retirer du projet
                              </span>
                              <p className="text-xs text-gray-500">
                                Retirer le membre du projet
                              </p>
                            </div>
                            <Icon name="bagpack" size="sm" />
                          </div>
                        </DropdownMenuItem>
                      )}

                      {/* Les contributeurs peuvent quitter le projet pour eux-mêmes */}
                      {!isCurrentUserOwner && isCurrentUser && (
                        <DropdownMenuItem>
                          <div className="flex w-full items-center justify-between">
                            <div className="flex flex-col gap-1">
                              <span className="font-medium">
                                Quitter le projet
                              </span>
                              <p className="text-xs text-gray-500">
                                Quitter le projet
                              </p>
                            </div>
                            <Icon name="bagpack" size="sm" />
                          </div>
                        </DropdownMenuItem>
                      )}
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
