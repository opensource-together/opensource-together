import Link from "next/link";

import ProjectCardComponent from "@/shared/components/shared/ProjectCard";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Icon } from "@/shared/components/ui/icon";

import { Profile } from "../types/profile.type";

interface PinnedProjectsProps {
  profile: Profile;
}

export default function PinnedProjects({ profile }: PinnedProjectsProps) {
  const { projects = [] } = profile;

  return (
    <div className="flex w-full flex-col gap-4">
      <h2 className="mb-5 gap-1 text-left text-lg font-medium tracking-tighter">
        Projets Rejoints
      </h2>

      {projects.length === 0 ? (
        <EmptyState
          title="Aucun projet rejoint"
          description="Découvrez des projets open source de la communauté et rejoignez-les."
          action={
            <Link href="/">
              <Button className="font-medium">
                Explorer les projets
                <Icon name="arrow-up-right" size="xs" variant="white" />
              </Button>
            </Link>
          }
        />
      ) : (
        projects.slice(0, 3).map((project) => (
          <ProjectCardComponent
            key={project.id}
            projectId={project.id}
            title={project.name}
            shortDescription={project.description || ""}
            image={project.image || ""}
            showViewProject={true}
            techStacks={
              project.techStacks?.map((tech) => ({
                id: tech.id,
                name: tech.name,
                iconUrl: tech.iconUrl,
              })) ?? []
            }
            author={{
              ownerId: project.author.ownerId,
              name: project.author.name,
              avatarUrl: project.author.avatarUrl,
            }}
            projectStats={{
              forks: project.projectStats?.forks || 0,
              contributors: project.projectStats?.contributors || [],
              stars: project.projectStats?.stars || 0,
              lastCommit: project.projectStats?.lastCommit?.date
                ? {
                    date: project.projectStats.lastCommit.date,
                    message: project.projectStats.lastCommit.message,
                    sha: project.projectStats.lastCommit.sha,
                    url: project.projectStats.lastCommit.url,
                    author: {
                      login: project.projectStats.lastCommit.author.login,
                      avatar_url:
                        project.projectStats.lastCommit.author.avatar_url,
                      html_url: project.projectStats.lastCommit.author.html_url,
                    },
                  }
                : undefined,
            }}
            className="w-full max-w-[731px] bg-white"
          />
        ))
      )}
    </div>
  );
}
