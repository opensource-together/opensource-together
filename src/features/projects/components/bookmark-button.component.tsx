"use client";

import { useState } from "react";
import { HiBookmark, HiOutlineBookmark } from "react-icons/hi2";

import { Button } from "@/shared/components/ui/button";

interface BookmarkButtonProps {
  projectId: string;
}

export function BookmarkButton({ projectId }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleToggleBookmark = () => {
    // TODO: Implement API call when endpoint is available
    setIsBookmarked((prev) => !prev);
  };

  return (
    <Button
      size="icon"
      variant="outline"
      className="size-9"
      onClick={handleToggleBookmark}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      {isBookmarked ? (
        <HiBookmark className="text-yellow-500" />
      ) : (
        <HiOutlineBookmark />
      )}
    </Button>
  );
}
