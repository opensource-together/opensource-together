import Image from "next/image";
import { useState } from "react";
import { IoChevronBack, IoChevronForward, IoEllipse } from "react-icons/io5";

import { Avatar } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import Icon from "@/shared/components/ui/icon";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { Project } from "../types/project.type";
import ProjectReadme from "./project-readme.component";

interface ProjectHeroProps {
  project: Project;
  hideHeader?: boolean;
}

export function ProjectHeroHeader({
  title,
  shortDescription,
  image,
  projectStats,
}: Project) {
  const stars = projectStats?.stars || 0;
  return (
    <div className="flex flex-col bg-white">
      <div className="flex items-center gap-4">
        <Avatar src={image} name={title} alt={title} size="xl" />
        <h1 className="flex-1 text-start text-2xl font-medium">{title}</h1>
        <button className="flex h-[35px] min-w-[70px] items-center justify-center gap-1 rounded-full border border-black/5 text-sm font-medium">
          <span>{stars || 0}</span>
          <Icon name="star" size="sm" />
        </button>
      </div>
      <p className="mt-4 text-sm font-normal">{shortDescription}</p>
      <Separator className="mt-5" />
    </div>
  );
}

export default function ProjectHero({
  project,
  hideHeader = false,
}: ProjectHeroProps) {
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = coverImages;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setIsDragging(true);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDragging) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const diff = clientX - startX;

    if (Math.abs(diff) > 50) {
      setIsDragging(false);
      setTranslateX(0);
      if (diff > 0) {
        handlePrevImage();
      } else {
        handleNextImage();
      }
      return;
    }

    setTranslateX(diff);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setTranslateX(0);
  };

  return (
    <div className="flex flex-col bg-white">
      {!hideHeader && (
        <div>
          <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <Avatar src={image} name={title} alt={title} size="xl" />
              <h1 className="text-start text-2xl font-medium sm:text-2xl">
                {title}
              </h1>
            </div>

            <button className="flex h-[35px] w-[70px] items-center justify-center gap-1 self-start rounded-full border border-black/5 text-sm font-medium sm:self-center">
              <span>{stars}</span>
              <Icon name="star" size="sm" />
            </button>
          </div>

          <div className="mt-2">
            <p className="mb-0 text-sm font-normal">{shortDescription}</p>
            <Separator className="my-5" />
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-2 flex flex-row gap-1">
          <div className="flex-1">
            <div
              className="relative h-[207px] w-full overflow-hidden rounded-md select-none sm:h-[393px]"
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
            >
              <div
                className={`flex h-full transition-transform duration-300 ${isDragging ? "transition-none" : ""}`}
                style={{
                  transform: `translateX(calc(${translateX}px - ${currentImageIndex * 100}%))`,
                }}
              >
                {images.map((img, idx) => (
                  <Image
                    key={idx}
                    src={img}
                    alt={`Image ${idx + 1}`}
                    width={688}
                    height={393}
                    className="h-[207px] w-full shrink-0 object-cover sm:h-[393px]"
                    priority={idx === currentImageIndex}
                  />
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  onClick={handlePrevImage}
                >
                  <IoChevronBack className="size-[11px]" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  onClick={handleNextImage}
                >
                  <IoChevronForward className="size-[11px]" />
                </Button>
              </div>
              <div className="mt-[-10px] flex gap-1">
                {images.map((_, idx) => (
                  <IoEllipse
                    key={idx}
                    className={`size-1.5 hover:cursor-pointer hover:text-neutral-500 ${
                      idx === currentImageIndex
                        ? "text-neutral-500"
                        : "text-neutral-200"
                    }`}
                    onClick={() => setCurrentImageIndex(idx)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {project.readme && (
        <ProjectReadme
          readme={project.readme}
          projectTitle={title}
          project={project}
        />
      )}

      <div className="mt-10 w-full max-w-[629px]">
        {keyFeatures.length > 0 && (
          <>
            <h3 className="text-primary mb-3 text-sm font-normal">
              Fonctionnalités clés
            </h3>
            <ul className="text-primary mb-8 list-disc space-y-1 pl-5 text-sm leading-loose font-normal">
              {keyFeatures.map((feature, index) => (
                <li key={index}>{feature.feature}</li>
              ))}
            </ul>
          </>
        )}

        {projectGoals.length > 0 && (
          <>
            <h3 className="text-primary mb-3 text-sm font-normal">
              Objectifs du projet
            </h3>
            <ul className="text-primary mb-8 list-disc space-y-1 pl-5 text-sm leading-loose font-normal">
              {projectGoals.map((goal, index) => (
                <li key={index}>{goal.goal}</li>
              ))}
            </ul>
          </>
        )}

        {!keyFeatures.length && !projectGoals.length && longDescription && (
          <p className="text-sm font-normal text-black/70">{longDescription}</p>
        )}
      </div>
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
