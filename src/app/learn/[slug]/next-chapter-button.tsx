"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiCheck, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { Button } from "@/shared/components/ui/button";
import { useChapterProgress } from "@/shared/hooks/use-chapter-progress.hook";
import { cn } from "@/shared/lib/utils";
import type { Chapter } from "../../../../content/chapters";

interface NextChapterButtonProps {
  currentChapter: Chapter;
  nextChapter: Chapter | null;
  prevChapter: Chapter | null;
  chaptersForProgress: Chapter[];
}

export function NextChapterButton({
  currentChapter,
  nextChapter,
  prevChapter,
  chaptersForProgress,
}: NextChapterButtonProps) {
  const router = useRouter();
  const { markChapterComplete, isChapterComplete, getProgressForChapters } =
    useChapterProgress();
  const chapterProgress = getProgressForChapters(chaptersForProgress);
  const isComplete = isChapterComplete(currentChapter.slug);

  const getChapterTitle = (chapter: Chapter) => {
    return chapter.title.replace(/^Chapter \d+: /, "");
  };

  const handleStartNextChapter = () => {
    markChapterComplete(currentChapter.slug);
    if (nextChapter) {
      router.push(`/learn/${nextChapter.slug}`);
    }
  };

  const handleMarkComplete = () => {
    markChapterComplete(currentChapter.slug);
  };

  return (
    <div className="mb-11 flex w-full flex-col items-center">
      {/* Next Chapter Card or Mark Complete Button */}
      {nextChapter ? (
        <div className="w-full rounded-[20px] border border-muted-black-stroke bg-card p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-muted-foreground text-sm">Next Up</span>
              <div className="flex flex-col gap-2">
                <h3 className="font-medium text-foreground text-lg">
                  Chapter {nextChapter.order}: {getChapterTitle(nextChapter)}
                </h3>
                {nextChapter.description && (
                  <p className="text-muted-foreground text-sm">
                    {nextChapter.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-[18px]">
              <div className="my-1 h-1.5 w-full overflow-hidden rounded-full bg-accent">
                <div
                  className="h-full bg-ost-blue-three transition-all duration-300"
                  style={{ width: `${chapterProgress.percentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {chapterProgress.completed} / {chapterProgress.total}{" "}
                  completed
                </span>
              </div>
            </div>
            <div className="flex flex-row items-stretch gap-3">
              {prevChapter ? (
                <Button
                  variant="outline"
                  asChild
                  className="min-w-0 flex-1 rounded-full border-black/5 bg-white shadow-none hover:bg-accent"
                >
                  <Link
                    href={`/learn/${prevChapter.slug}`}
                    className="!inline-flex !flex-row !items-center !justify-between w-full min-w-0 gap-2 px-3"
                  >
                    <HiChevronLeft className="size-4 shrink-0" />
                    <span className="shrink-0">Previous</span>
                  </Link>
                </Button>
              ) : null}
              <Button
                onClick={handleStartNextChapter}
                className="group flex min-w-0 flex-1 justify-between gap-2 px-4"
              >
                <span className="min-w-0 truncate text-left">
                  Start Chapter {nextChapter.order}
                </span>
                <HiChevronRight className="size-4 shrink-0" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full max-w-md flex-row items-stretch justify-center gap-3">
          {prevChapter ? (
            <Button
              variant="outline"
              asChild
              className="min-w-0 flex-1 rounded-full border-black/5 bg-white shadow-none hover:bg-accent"
            >
              <Link
                href={`/learn/${prevChapter.slug}`}
                className="!inline-flex !flex-row !items-center !justify-between w-full min-w-0 gap-2 px-3"
              >
                <HiChevronLeft className="size-4 shrink-0" />
                <span className="shrink-0">Previous</span>
              </Link>
            </Button>
          ) : null}
          <Button
            onClick={handleMarkComplete}
            className={cn("group min-w-0", prevChapter ? "flex-1" : "w-full")}
            disabled={isComplete}
          >
            <HiCheck className="h-4 w-4" />
            Mark as Complete
          </Button>
        </div>
      )}
    </div>
  );
}
