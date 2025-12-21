"use client";

import { useCallback, useEffect, useState } from "react";
import type { Chapter } from "../../../content/chapters";

const STORAGE_KEY = "learn-chapter-progress";

interface ChapterProgress {
  [slug: string]: boolean;
}

export function useChapterProgress() {
  const [progress, setProgress] = useState<ChapterProgress>({});

  const loadProgress = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      } else {
        setProgress({});
      }
    } catch {}
  }, []);

  useEffect(() => {
    loadProgress();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loadProgress();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loadProgress]);

  const markChapterComplete = useCallback((slug: string) => {
    setProgress((prev) => {
      const updated = { ...prev, [slug]: true };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const isChapterComplete = useCallback(
    (slug: string) => {
      return progress[slug] === true;
    },
    [progress]
  );

  const getProgressForChapters = useCallback(
    (chapters: Chapter[]) => {
      const completed = chapters.filter(
        (ch) => progress[ch.slug] === true
      ).length;
      return {
        completed,
        total: chapters.length,
        percentage:
          chapters.length > 0 ? (completed / chapters.length) * 100 : 0,
      };
    },
    [progress]
  );

  return {
    progress,
    markChapterComplete,
    isChapterComplete,
    getProgressForChapters,
  };
}
