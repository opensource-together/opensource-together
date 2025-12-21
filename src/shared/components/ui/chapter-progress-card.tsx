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
    <div className="relative overflow-hidden rounded-[20px] border border-muted-black-stroke p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="font-medium text-xl">{title}</h2>
          <p className="mt-2 line-clamp-1 text-xs">{description}</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="my-1 h-1.5 w-full overflow-hidden rounded-full bg-accent">
            <div
              className="h-full bg-ost-blue-three transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {progress.completed} / {progress.total} completed
          </span>
        </div>

        {/* Current Chapter Card */}
        {currentChapter && (
          <div className="flex items-center gap-3 rounded-full bg-secondary px-3 py-2 transition-all hover:border-ost-blue-three hover:bg-accent">
            <div className="flex size-8 shrink-0 items-center justify-center">
              {isChapterComplete(currentChapter.slug) ? (
                <HiCheckCircle className="size-8 text-ost-blue-three" />
              ) : (
                <CircularProgress percentage={progress.percentage} />
              )}
            </div>
            <span className="flex-1 truncate font-medium text-xs">
              {currentChapter.title}
            </span>
          </div>
        )}
        <Link href={`/learn/${currentChapter?.slug || firstChapterSlug}`}>
          <Button className="w-full">
            {hasCompletedChapters ? "Resume Learning" : "Start Learning"}
            <HiChevronRight className="size-3" />
          </Button>
        </Link>
        <Button variant="ghost">Browse Chapters</Button>
      </div>
    </div>
  );
}
