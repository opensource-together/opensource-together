import Image from "next/image";

import { Avatar } from "@/shared/components/ui/avatar";
import Icon from "@/shared/components/ui/icon";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { Project } from "../types/project.type";
import ProjectReadme from "./project-readme.component";

interface ProjectHeroProps {
  project: Project;
}

export default function ProjectHero({ project }: ProjectHeroProps) {
  const {
    title = "",
    shortDescription = "",
    longDescription,
    coverImages = [],
    keyFeatures = [],
    projectGoals = [],
    image,
    projectStats,
  } = project;

  const stars = projectStats?.stars || 0;

  return (
    <section className="flex flex-col bg-white">
      {/* Header with logo and stars */}
      <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        {/* Project Icon and Title */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Avatar src={image} name={title} alt={title} size="xl" />
          {/* Project Title */}
          <h1 className="text-start text-2xl font-medium tracking-tighter text-black sm:text-3xl">
            {title}
          </h1>
        </div>

        {/* Stars button */}
        <button className="flex h-[35px] w-[70px] items-center justify-center gap-1 self-start rounded-full border border-black/5 text-sm font-medium sm:self-center">
          <span>{stars}</span>
          <Icon name="star" size="sm" />
        </button>
      </div>

      {/* Description */}
      <div className="mt-2">
        <p className="text-md mb-0 font-medium">{shortDescription}</p>

        {/* separator */}
        <div className="my-5 h-[2px] w-full bg-black/3" />

        {coverImages.length > 0 && (
          <div className="mt-2 flex flex-row gap-1">
            {/* Main large image */}
            <div className="flex-1">
              <Image
                src={coverImages[0]}
                alt={title}
                width={700}
                height={400}
                className="h-[272px] w-full rounded-md object-cover"
                priority
                onError={(e) => {
                  console.warn(`Failed to load image: ${coverImages[0]}`);
                  // Hide the image container and show a placeholder
                  const target = e.target as HTMLImageElement;
                  const container = target.closest("div");
                  if (container) {
                    container.innerHTML = `
                      <div class="h-[272px] w-full rounded-md bg-gray-100 flex items-center justify-center">
                        <span class="text-gray-400 text-sm">Image non disponible</span>
                      </div>
                    `;
                  }
                }}
              />
            </div>
            {/* Thumbnails on the right */}
            {coverImages.length > 1 && (
              <div className="flex min-w-[180px] flex-col gap-1">
                {coverImages.slice(1, 4).map((img, idx) => (
                  <div key={img} className="h-[88px] w-[140px]">
                    <Image
                      src={img}
                      alt={`${title} cover ${idx + 2}`}
                      width={140}
                      height={88}
                      className="h-full w-full rounded-md object-cover"
                      onError={(e) => {
                        console.warn(`Failed to load image: ${img}`);
                        // Hide the image and show a placeholder
                        const target = e.target as HTMLImageElement;
                        const container = target.closest("div");
                        if (container) {
                          container.innerHTML = `
                            <div class="h-[88px] w-[140px] rounded-md bg-gray-100 flex items-center justify-center">
                              <span class="text-gray-400 text-xs">Image non disponible</span>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {project.readme && (
          <ProjectReadme readme={project.readme} projectTitle={title} />
        )}

        <div className="mt-10 w-full max-w-[629px]">
          {keyFeatures.length > 0 && (
            <>
              <h3 className="mb-3 font-medium text-black">
                Fonctionnalités clés
              </h3>
              <ul className="mb-8 list-disc space-y-1 pl-5 text-sm leading-loose font-normal text-black">
                {keyFeatures.map((feature, index) => (
                  <li key={index}>{feature.feature}</li>
                ))}
              </ul>
            </>
          )}

          {projectGoals.length > 0 && (
            <>
              <h3 className="mb-3 font-medium text-black">
                Objectifs du projet
              </h3>
              <ul className="mb-8 list-disc space-y-1 pl-5 text-sm leading-loose font-normal text-black">
                {projectGoals.map((goal, index) => (
                  <li key={index}>{goal.goal}</li>
                ))}
              </ul>
            </>
          )}

          {!keyFeatures.length && !projectGoals.length && longDescription && (
            <p className="text-sm font-normal text-black/70">
              {longDescription}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export function SkeletonProjectHero() {
  return (
    <section className="flex min-h-[634px] w-[710px] flex-col rounded-3xl border border-[black]/10 bg-white p-10 shadow-[0_0_0.5px_0_rgba(0,0,0,0.20)]">
      {/* Header */}
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

      {/* Description */}
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

      {/* Technical Stack */}
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
