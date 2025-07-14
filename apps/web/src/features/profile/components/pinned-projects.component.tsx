import Link from "next/link";

import ProjectCardComponent from "@/shared/components/shared/ProjectCard";
import { Button } from "@/shared/components/ui/button";
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
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-gray-50 py-16 text-center">
          <h3 className="mb-2 text-base font-medium tracking-tight text-gray-900">
            Aucun projet rejoint
          </h3>
          <p className="mb-6 max-w-sm text-sm text-gray-500">
            Découvrez des projets open source de la communauté et rejoignez-les.
          </p>
          <Link href="/">
            <Button className="font-medium">
              Explorer les projets
              <Icon name="arrow-up-right" size="xs" variant="white" />
            </Button>
          </Link>
        </div>
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
              contributors: project.projectStats?.contributors || 0,
              stars: project.projectStats?.stars || 0,
              lastCommitAt: project.projectStats?.lastCommitAt || new Date(),
            }}
            className="w-full max-w-[731px] bg-white"
          />
        ))
      )}
    </div>
  );
}
