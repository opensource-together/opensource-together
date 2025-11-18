import Link from "next/link";
import { useState } from "react";

import { Avatar } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Modal } from "@/shared/components/ui/modal";

import { useCacheBustingImage } from "../../../shared/hooks/use-cache-busting-image.hook";
import { useToggleProjectPublished } from "../hooks/use-projects.hook";
import { Project } from "../types/project.type";
import { BookmarkButton } from "./bookmark-button.component";
import { ClaimProjectButton } from "./claim-project-button.component";

export function ProjectMobileHero({ project }: ProjectHeroProps) {
  const [isPublishDialogOpen, setPublishDialogOpen] = useState(false);
  const { toggleProjectPublished, isTogglingPublished } =
    useToggleProjectPublished();

  const {
    id = "",
    title = "",
    description = "",
    logoUrl,
    repoUrl = "",
    published = false,
    updatedAt,
  } = project;

  const logoUrlWithCacheBusting = useCacheBustingImage(logoUrl, updatedAt);

  return (
    <div className="flex flex-col bg-white">
      <div className="flex min-w-0 items-center gap-4">
        <Avatar
          src={logoUrlWithCacheBusting}
          name={title}
          alt={title}
          size="lg"
          shape="rounded"
        />
        <h1 className="flex-1 truncate text-start text-xl font-medium">
          {title}
        </h1>
      </div>

      <p className="mt-4 mb-8 line-clamp-5 text-sm font-normal break-words">
        {description}
      </p>
      <div className="flex items-center gap-2">
        {published ? (
          <>
            <BookmarkButton projectId={id} />
            <ClaimProjectButton project={project} />
            <Link
              href={repoUrl || ""}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>View Repository</Button>
            </Link>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => setPublishDialogOpen(true)}
            >
              Publish Project
            </Button>
            <Link href={`/projects/${id}/edit`}>
              <Button>Edit Project</Button>
            </Link>

            <Modal
              open={isPublishDialogOpen}
              onOpenChange={setPublishDialogOpen}
              title="Publish project?"
              description="Once published, your project becomes visible to everyone. You can unpublish later."
              isLoading={isTogglingPublished}
              onConfirm={() =>
                toggleProjectPublished({ project, published: true })
              }
              onCancel={() => setPublishDialogOpen(false)}
              confirmText="Publish"
            />
          </>
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
  const [isPublishDialogOpen, setPublishDialogOpen] = useState(false);
  const { toggleProjectPublished, isTogglingPublished } =
    useToggleProjectPublished();
  const {
    id = "",
    title = "",
    description = "",
    logoUrl,
    repoUrl = "",
    published = false,
    updatedAt,
  } = project;

  const logoUrlWithCacheBusting = useCacheBustingImage(logoUrl, updatedAt);

  return (
    <div className="flex flex-col bg-white">
      {!hideHeader && (
        <div>
          <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <Avatar
                src={logoUrlWithCacheBusting}
                name={title}
                alt={title}
                size="xl"
                shape="rounded"
              />
              <h1 className="max-w-[70vw] truncate text-start text-2xl font-medium sm:max-w-[45vw] sm:text-2xl">
                {title}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {published ? (
                <>
                  <BookmarkButton projectId={id} />
                  <ClaimProjectButton project={project} />
                  <Link
                    href={repoUrl || ""}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button>View Repository</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setPublishDialogOpen(true)}
                  >
                    Publish Project
                  </Button>
                  <Link href={`/projects/${id}/edit`}>
                    <Button>Edit Project</Button>
                  </Link>

                  <Modal
                    open={isPublishDialogOpen}
                    onOpenChange={setPublishDialogOpen}
                    title="Publish project?"
                    description="Once published, your project becomes visible to everyone. You can unpublish later."
                    isLoading={isTogglingPublished}
                    onConfirm={() =>
                      toggleProjectPublished({ project, published: true })
                    }
                    onCancel={() => setPublishDialogOpen(false)}
                    confirmText="Publish"
                  />
                </>
              )}
            </div>
          </div>

          <p className="mt-4 line-clamp-6 text-sm break-words">{description}</p>
        </div>
      )}
    </div>
  );
}
