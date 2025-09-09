import Link from "next/link";

import ProjectCardComponent from "@/shared/components/shared/ProjectCard";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Icon } from "@/shared/components/ui/icon";

import useAuth from "@/features/auth/hooks/use-auth.hook";
import { useMyProjects } from "@/features/dashboard/hooks/use-my-projects.hook";

import { Profile } from "../types/profile.type";

interface PinnedProjectsProps {
  profile: Profile;
}

export default function PinnedProjects({ profile }: PinnedProjectsProps) {
  const { currentUser } = useAuth();
  const { data: myProjects = [], isLoading } = useMyProjects();

  const joinedProjects = myProjects.filter(
    (project) => project.owner.id !== profile.id
  );

  return (
    <div className="flex w-full flex-col gap-[25px]">
      <h2 className="text-muted-foreground text-sm">
        <span className="text-primary font-medium">
          {joinedProjects.length}
        </span>{" "}
        {joinedProjects.length === 1
          ? "Projet Rejoint"
          : "Projets Rejoints"}{" "}
      </h2>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-full rounded-2xl border border-[#000000]/10 bg-white p-6 shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex flex-col gap-2">
                  <div className="h-6 w-40 animate-pulse rounded-md bg-gray-200" />
                  <div className="h-4 w-full max-w-[500px] animate-pulse rounded-md bg-gray-200" />
                </div>
                <div className="size-12 animate-pulse rounded-lg bg-gray-200" />
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                {[...Array(3)].map((_, techIndex) => (
                  <div
                    key={techIndex}
                    className="h-6 w-20 animate-pulse rounded-md bg-gray-200"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : joinedProjects.length === 0 ? (
        <EmptyState
          title="Aucun projet rejoint"
          description={
            profile.id === currentUser?.id
              ? "Découvrez des projets open source de la communauté et rejoignez-les."
              : "Cet utilisateur n'a pas encore rejoint de projet."
          }
          action={
            profile.id === currentUser?.id && (
              <Link href="/">
                <Button className="font-medium">
                  Explorer les projets
                  <Icon name="arrow-up-right" size="xs" variant="white" />
                </Button>
              </Link>
            )
          }
        />
      ) : (
        joinedProjects.slice(0, 3).map((project) => (
          <ProjectCardComponent
            key={project.id}
            projectId={project.id}
            title={project.title}
            shortDescription={project.shortDescription}
            image={project.image || ""}
            showViewProject={false}
            techStacks={project.techStacks}
            owner={{
              id: project.owner.id,
              username: project.owner.username,
              avatarUrl: project.owner.avatarUrl,
            }}
            projectStats={{
              forks: 0,
              contributors: project.teamMembers.map((member) => ({
                id: member.id,
                username: member.name,
                avatarUrl: member.avatarUrl || "",
                contributions: 1,
              })),
              stars: 0,
              watchers: 0,
              openIssues: 0,
              commits: 0,
              lastCommit: {
                sha: "",
                message: "",
                date: "",
                url: "",
                author: { login: "", avatar_url: "", html_url: "" },
              },
            }}
            className="w-full"
          />
        ))
      )}
    </div>
  );
}
