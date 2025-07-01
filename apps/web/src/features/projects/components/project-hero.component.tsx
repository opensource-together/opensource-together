import Image from "next/image";

import { Skeleton } from "@/shared/components/ui/skeleton";

import { Project } from "../types/project.type";

interface ProjectHeroProps {
  project: Project;
}

export default function ProjectHero({ project }: ProjectHeroProps) {
  const {
    title = "",
    description = "",
    longDescription,
    keyBenefits = [],
    image,
    communityStats,
  } = project;

  const stars = communityStats?.stars || 0;

  return (
    <section className="flex flex-col bg-white">
      {/* Header with logo and stars */}
      <div className="mb-2 flex items-center justify-between">
        {/* Project Icon and Title */}
        <div className="flex items-center gap-4">
          <div className="flex h-[65px] w-[65px] items-center justify-center rounded-4xl bg-[#F4F4F4]">
            <Image
              src={image || "/icons/empty-project.svg"}
              alt={title}
              width={65}
              height={65}
              className="rounded-4xl"
            />
          </div>
          {/* Project Title */}
          <h1
            className="text-start text-3xl font-medium text-black"
            style={{ letterSpacing: "-2px" }}
          >
            {title}
          </h1>
        </div>

        {/* Stars button */}
        <button className="flex h-[35px] w-[70px] items-center justify-center gap-1 rounded-full border border-black/5 text-sm font-medium">
          <span>{stars}</span>
          <Image
            src="/icons/empty-star.svg"
            alt="star"
            width={16}
            height={16}
            className="rounded-4xl"
          />
        </button>
      </div>

      {/* Description */}
      <div className="mt-2">
        <p className="mb-0 text-sm font-medium">{description}</p>

        {/* separator */}
        <div className="my-5 h-[1px] w-full bg-black/10" />

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
