"use client";

import Link from "next/link";
import { HiCheckCircle } from "react-icons/hi2";
import { useChapterProgress } from "@/shared/hooks/use-chapter-progress.hook";
import type { Chapter } from "../../../../content/chapters";

interface ChaptersListProps {
  chapters: Chapter[];
}

export function ChaptersList({ chapters }: ChaptersListProps) {
  const { isChapterComplete } = useChapterProgress();

  const getChapterTitle = (ch: Chapter) => {
    return ch.title.replace(/^Chapter \d+: /, "");
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {chapters.map((chapter) => {
        const isComplete = isChapterComplete(chapter.slug);

        return (
          <Link
            key={chapter.slug}
            href={`/learn/${chapter.slug}`}
            className="group flex items-center gap-2 rounded-[20px] border border-muted-black-stroke bg-card p-4 transition-all hover:bg-accent"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex size-8 shrink-0 items-center justify-center">
                {isComplete ? (
                  <HiCheckCircle className="size-6 text-ost-blue-three" />
                ) : (
                  <span className="font-medium text-muted-foreground text-xs">
                    {chapter.order}
                  </span>
                )}
              </div>
            </div>
            <h3 className="line-clamp-2 font-medium text-foreground text-sm">
              {getChapterTitle(chapter)}
            </h3>
          </Link>
        );
      })}
    </div>
  );
}
