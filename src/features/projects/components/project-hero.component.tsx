import Link from "next/link";

import { Avatar } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import Icon from "@/shared/components/ui/icon";

import { Project } from "../types/project.type";

export function ProjectMobileHero({ project }: ProjectHeroProps) {
  const {
    id = "",
    title = "",
    description = "",
    logoUrl,
    repoUrl = "",
    published = false,
  } = project;

  return (
    <div className="flex flex-col bg-white">
      <div className="flex items-center gap-4">
        <Avatar
          src={logoUrl}
          name={title}
          alt={title}
          size="lg"
          shape="rounded"
        />
        <h1 className="flex-1 text-start text-xl font-medium">{title}</h1>
      </div>

      <p className="mt-4 mb-8 text-sm font-normal">{description}</p>
      <div className="flex items-center gap-2">
        {published ? (
          <>
            <Link
              href={repoUrl || ""}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">
                <Icon name="star" size="sm" />
                Star
              </Button>
            </Link>
            <Link
              href={repoUrl || ""}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>View Repository</Button>
            </Link>
          </>
        ) : (
          <Link href={`/projects/${id}/edit`}>
            <Button>Edit Project</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
interface ProjectHeroProps {
  project: Project;
  hideHeader?: boolean;
}

export default function ProjectHero({
  project,
  hideHeader = false,
}: ProjectHeroProps) {
  const {
    id = "",
    title = "",
    description = "",
    logoUrl,
    repoUrl = "",
    published = false,
  } = project;

  return (
    <div className="flex flex-col bg-white">
      {!hideHeader && (
        <div>
          <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <Avatar
                src={logoUrl}
                name={title}
                alt={title}
                size="xl"
                shape="rounded"
              />
              <h1 className="text-start text-2xl font-medium sm:text-2xl">
                {title}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {published ? (
                <>
                  <Link
                    href={repoUrl || ""}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline">
                      <Icon name="star" size="sm" />
                      Star
                    </Button>
                  </Link>
                  <Link
                    href={repoUrl || ""}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button>View Repository</Button>
                  </Link>
                </>
              ) : (
                <Link href={`/projects/${id}/edit`}>
                  <Button>Edit Project</Button>
                </Link>
              )}
            </div>
          </div>

          <p className="mt-4 text-sm">{description}</p>
        </div>
      )}
    </div>
  );
}
