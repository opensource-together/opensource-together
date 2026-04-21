"use client";

import Link from "next/link";
import { HiCheckCircle, HiChevronRight } from "react-icons/hi2";
import { Button } from "@/shared/components/ui/button";
import { useChapterProgress } from "@/shared/hooks/use-chapter-progress.hook";
import type { Chapter } from "../../../../content/chapters";

interface ChapterProgressCardProps {
  title: string;
  description: string;
  chapters: Chapter[];
  firstChapterSlug: string;
}

function CircularProgress({ percentage }: { percentage: number }) {
  const size = 32;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg
      aria-label="Circular progress bar"
      role="img"
      width={size}
      height={size}
      className="-rotate-90 transform"
      viewBox={`0 0 ${size} ${size}`}
    >
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-muted-black-stroke"
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-ost-blue-three transition-all duration-300"
      />
    </svg>
  );
}

export function ChapterProgressCard({
  title,
  description,
  chapters,
  firstChapterSlug,
}: ChapterProgressCardProps) {
  const { getProgressForChapters, isChapterComplete } = useChapterProgress();
  const progress = getProgressForChapters(chapters);

  const firstIncompleteChapter = chapters.find(
    (chapter) => !isChapterComplete(chapter.slug)
  );
  const currentChapter = firstIncompleteChapter || chapters[0];
  const hasCompletedChapters = progress.completed > 0;

  return (
    <div className="relative overflow-hidden rounded-[20px] border border-muted-black-stroke px-6 pt-6 pb-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2.5">
          <h2 className="font-medium text-[calc(1.25rem-2px)] leading-snug">
            {title}
          </h2>
          <p className="line-clamp-1 text-[calc(0.75rem+2px)] text-muted-foreground leading-normal">
            {description}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="my-1 h-1.5 w-full overflow-hidden rounded-full bg-accent">
            <div
              className="h-full bg-ost-blue-three transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between pb-[2px] text-xs">
            <span className="text-muted-foreground">
              {progress.completed} / {progress.total} completed
            </span>
          </div>
        </div>

        {currentChapter ? (
          <Link
            href={`/learn/${currentChapter.slug || firstChapterSlug}`}
            className="block w-full rounded-full focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            aria-label={
              hasCompletedChapters
                ? `Resume learning: ${currentChapter.title}`
                : `Start learning: ${currentChapter.title}`
            }
          >
            <div className="flex origin-center cursor-pointer items-center gap-3 rounded-full bg-secondary px-3 py-2 transition-all hover:scale-[0.98] hover:bg-accent">
              <div className="flex size-8 shrink-0 items-center justify-center">
                {isChapterComplete(currentChapter.slug) ? (
                  <HiCheckCircle className="size-8 text-ost-blue-three" />
                ) : (
                  <CircularProgress percentage={progress.percentage} />
                )}
              </div>
              <span className="min-w-0 flex-1 truncate font-medium text-xs">
                {currentChapter.title}
              </span>
              <HiChevronRight
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
            </div>
          </Link>
        ) : null}
        <Link href="/learn/chapters" className="block w-full">
          <Button
            variant="default"
            className="w-full justify-between gap-2 px-4"
          >
            <span className="min-w-0 truncate text-left">Browse Chapters</span>
            <HiChevronRight className="size-3 shrink-0" aria-hidden />
          </Button>
        </Link>
      </div>
    </div>
  );
}
