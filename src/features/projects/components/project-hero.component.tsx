import Link from "next/link";

import { Avatar } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import Icon from "@/shared/components/ui/icon";
import ImageSlider from "@/shared/components/ui/image-slider.component";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { Project } from "../types/project.type";
import ProjectReadme from "./project-readme.component";

export function ProjectMobileHero({
  title,
  description,
  logoUrl,
  githubUrl,
}: Project) {
  return (
    <div className="flex flex-col bg-white">
      <div className="flex items-center gap-4">
        <Avatar src={logoUrl} name={title} alt={title} size="lg" />
        <h1 className="flex-1 text-start text-xl font-medium">{title}</h1>
      </div>

      <p className="mt-4 mb-8 text-sm font-normal">{description}</p>
      <div className="flex items-center gap-2">
        <Link href={githubUrl || ""} target="_blank" rel="noopener noreferrer">
          <Button variant="outline">
            <Icon name="star" size="sm" />
            Star
          </Button>
        </Link>
        <Link href={githubUrl || ""} target="_blank" rel="noopener noreferrer">
          <Button>View Repository</Button>
        </Link>
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
    title = "",
    description = "",
    imagesUrls = [],
    logoUrl,
    githubUrl = "",
  } = project;

  return (
    <div className="flex flex-col bg-white">
      {!hideHeader && (
        <div>
          <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <Avatar src={logoUrl} name={title} alt={title} size="xl" />
              <h1 className="text-start text-2xl font-medium sm:text-2xl">
                {title}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={githubUrl || ""}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">
                  <Icon name="star" size="sm" />
                  Star
                </Button>
              </Link>
              <div className="flex gap-2">
                <Link
                  href={githubUrl || ""}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button>View Repository</Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-0 text-sm font-normal">{description}</p>
            <Separator className="my-5" />
          </div>
        </div>
      )}

      {imagesUrls.length > 0 && <ImageSlider images={imagesUrls} />}

      {project.readme && (
        <ProjectReadme
          readme={project.readme}
          projectTitle={title}
          project={{
            externalLinks: [
              project.githubUrl && { type: "GITHUB", url: project.githubUrl },
              project.gitlabUrl && { type: "GITLAB", url: project.gitlabUrl },
              project.twitterUrl && {
                type: "TWITTER",
                url: project.twitterUrl,
              },
              project.linkedinUrl && {
                type: "LINKEDIN",
                url: project.linkedinUrl,
              },
              project.discordUrl && {
                type: "DISCORD",
                url: project.discordUrl,
              },
              project.websiteUrl && {
                type: "WEBSITE",
                url: project.websiteUrl,
              },
            ].filter(Boolean) as { type: string; url: string }[],
          }}
        />
      )}
    </div>
  );
}

export function SkeletonProjectHero() {
  return (
    <section className="flex min-h-[634px] w-[710px] flex-col rounded-3xl border border-[black]/10 bg-white p-10 shadow-[0_0_0.5px_0_rgba(0,0,0,0.20)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Skeleton className="h-[80px] w-[82px] rounded-[16px]" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-4">
          <Skeleton className="h-[20px] w-[118px] rounded-full" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-[43px] w-[130px]" />
            <Skeleton className="ml-2 h-[43px] w-[120px]" />
          </div>
        </div>
      </div>

      <div className="mt-2">
        <Skeleton className="mb-2 h-5 w-40" />
        <Skeleton className="mb-2 h-4 w-3/4" />
        <div className="mt-2 flex w-[629px] flex-col gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>

      <div className="mt-8 mb-3 w-full border-t border-dashed border-black/10" />

      <div className="mt-2">
        <Skeleton className="mb-3 h-5 w-32" />
        <div className="flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[28px] w-[60px]" />
          ))}
        </div>
      </div>
    </section>
  );
}
