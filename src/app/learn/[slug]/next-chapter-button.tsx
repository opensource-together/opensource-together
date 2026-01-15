"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { HiCheck, HiChevronRight } from "react-icons/hi2";
import { Button } from "@/shared/components/ui/button";
import { useChapterProgress } from "@/shared/hooks/use-chapter-progress.hook";
import type { Chapter } from "../../../../content/chapters";

interface NextChapterButtonProps {
  currentChapter: Chapter;
  nextChapter: Chapter | null;
}

export function NextChapterButton({
  currentChapter,
  nextChapter,
}: NextChapterButtonProps) {
  const router = useRouter();
  const { markChapterComplete, isChapterComplete } = useChapterProgress();
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
    <div className="flex w-full flex-col items-center gap-8">
      {/* Completion Section */}
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Large circle with chapter number and checkmark */}
        <div className="relative">
          <div className="flex size-20 items-center justify-center rounded-full border border-muted-black-stroke">
            <span className="font-bold text-2xl text-ost-blue-three">
              <Image
                src="/icons/early-badge.svg"
                alt="Earl Grey Badge"
                width={48}
                height={48}
              />
            </span>
          </div>
        </div>

        {/* Completion message */}
        <div className="flex flex-col gap-2">
          <h2 className="font-medium text-2xl text-foreground">
            You&apos;ve Completed Chapter {currentChapter.order}
          </h2>
          <p className="text-base text-muted-foreground">
            Well done! You&apos;ve learned about{" "}
            {currentChapter.description ||
              getChapterTitle(currentChapter).toLowerCase()}
            .
          </p>
        </div>
      </div>

      {/* Next Chapter Card or Mark Complete Button */}
      {nextChapter ? (
        <div className="w-full max-w-md rounded-[20px] border border-muted-black-stroke bg-card p-6">
          <div className="flex flex-col gap-6">
            <span className="text-muted-foreground text-sm">Next Up</span>
            <div className="flex flex-col gap-2">
              <h3 className="font-medium text-foreground text-lg">
                {nextChapter.order}: {getChapterTitle(nextChapter)}
              </h3>
              {nextChapter.description && (
                <p className="text-muted-foreground text-sm">
                  {nextChapter.description}
                </p>
              )}
            </div>
            <Button onClick={handleStartNextChapter} className="group w-full">
              Start Chapter {nextChapter.order}
              <HiChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={handleMarkComplete}
          className="group flex items-center gap-2"
          disabled={isComplete}
        >
          <HiCheck className="h-4 w-4" />
          Mark as Complete
        </Button>
      )}
    </div>
  );
}
