import Image from "next/image";

import { AuthorTag } from "@/components/shared/AuthorTag";
import DifficultyBars from "@/components/shared/DifficultyBars";
import { StackIcon } from "@/components/shared/StackIcon";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { Project } from "../types/projectTypes";

interface ProjectHeroProps {
  project: Project;
}

export default function ProjectHero({ project }: ProjectHeroProps) {
  const {
    title = "",
    description = "",
    longDescription,
    keyBenefits = [],
    difficulty = "",
    authorName = "",
    authorImage = "/icons/empty-project.svg",
    techStacks = [],
    projectImages = [],
  } = project;

  // Images par défaut si projectImages est vide
  const defaultImages = [
    "/images/gitify-1.png",
    "/images/gitify-2.png",
    "/images/gitify-3.png",
    "/images/gitify-4.png",
  ];

  // Utiliser les images du projet ou les images par défaut
  const imagesToDisplay =
    projectImages.length > 0 ? projectImages : defaultImages;

  return (
    <section className="flex flex-col bg-white">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex gap-5">
          {/* Project Images */}
          <div className="flex gap-3">
            {/* Main large image */}
            {imagesToDisplay[0] && (
              <Image
                src={imagesToDisplay[0]}
                alt={title}
                width={520}
                height={255}
                className="h-[255px] w-[520px] flex-shrink-0 rounded-lg object-cover"
              />
            )}

            {/* Three stacked smaller images */}
            <div className="flex flex-shrink-0 flex-col gap-2">
              {imagesToDisplay.slice(1, 4).map((imageUrl, index) => (
                <Image
                  key={index}
                  src={imageUrl}
                  alt={`${title} - Image ${index + 2}`}
                  width={141}
                  height={79}
                  className="h-[79px] w-[141px] flex-shrink-0 rounded-lg object-cover"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Project Title and Author */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl leading-tight font-medium">{title}</h1>
          <AuthorTag name={authorName} image={authorImage} />
        </div>
        <div className="flex flex-col items-end gap-4">
          <DifficultyBars difficulty={difficulty} />
          <div className="flex items-center gap-3">
            <Button variant="outline">
              Voir le Repository
              <Image
                src="/icons/github.svg"
                alt="arrowright"
                width={15}
                height={15}
              />
            </Button>
            <Button>
              Rejoindre le projet
              <Image
                src="/icons/joined.svg"
                alt="joined"
                width={10}
                height={10}
                style={{ filter: "invert(1)" }}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-2">
        <h2 className="mb-2 font-medium">Description du projet</h2>
        <p className="mb-4 text-sm font-normal text-black/70">{description}</p>
        <div className="w-[629px]">
          {keyBenefits.length > 0 && (
            <>
              <p className="text-sm leading-[16px] font-normal text-black/70">
                Les avantages clés de notre outil de suivi de l'empreinte
                carbone incluent:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-[16px] font-normal text-black/70">
                {keyBenefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </>
          )}
          {!keyBenefits.length && longDescription && (
            <p className="text-sm font-normal text-black/70">
              {longDescription}
            </p>
          )}
        </div>
      </div>

      {/* Ligne de séparation */}
      <div className="mt-12 mb-3 w-full border-t border-dashed border-black/10"></div>

      {/* Technical Stack */}
      <div className="pt-4">
        <h3 className="mb-3 text-sm font-medium">Stack Technique</h3>
        <div className="flex gap-3">
          {techStacks.length > 0 &&
            techStacks.map((tech, index) => (
              <StackIcon
                key={index}
                name={tech.name}
                icon={tech.iconUrl || "/icons/empty-project.svg"}
                alt={tech.name}
              />
            ))}
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
