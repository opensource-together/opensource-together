"use client";

import { HiBookmark, HiOutlineBookmark } from "react-icons/hi2";

import { Button } from "@/shared/components/ui/button";

import { useProjectBookmark } from "../hooks/use-projects.hook";

interface BookmarkButtonProps {
  projectId: string;
  initialIsBookmarked?: boolean;
}

export function BookmarkButton({
  projectId,
  initialIsBookmarked = false,
}: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark, isBookmarking } = useProjectBookmark({
    projectId,
    initialIsBookmarked,
  });

  return (
    <Button
      size="icon"
      variant="outline"
      className="size-9"
      onClick={toggleBookmark}
      disabled={isBookmarking}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      {isBookmarked ? (
        <HiBookmark className="text-primary" />
      ) : (
        <HiOutlineBookmark />
      )}
    </Button>
  );
}
