"use client";

import { useRouter } from "next/navigation";
import { HiBookmark, HiOutlineBookmark } from "react-icons/hi2";
import { useCurrentUserQuery } from "@/features/auth/hooks/auth.queries";
import { Button } from "@/shared/components/ui/button";

import { useProjectBookmark } from "../hooks/use-project-bookmark";

interface BookmarkButtonProps {
  projectId: string;
  initialIsBookmarked?: boolean;
}

export function BookmarkButton({
  projectId,
  initialIsBookmarked = false,
}: BookmarkButtonProps) {
  const router = useRouter();
  const isAuthenticated = !!useCurrentUserQuery().data;
  const { isBookmarked, toggleBookmarkAsync, isPending } = useProjectBookmark({
    projectId,
    initialIsBookmarked,
  });

  const handleToggleBookmark = async () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    try {
      await toggleBookmarkAsync();
    } catch (_error) {
      // Error handling and toast are now managed in the hook
    }
  };

  return (
    <Button
      size="icon"
      variant="outline"
      className="size-9"
      onClick={() => void handleToggleBookmark()}
      disabled={isPending}
      aria-label={
        isPending
          ? "Updating bookmark"
          : isBookmarked
            ? "Remove bookmark"
            : "Add bookmark"
      }
    >
      {isBookmarked ? (
        <HiBookmark className="text-primary" />
      ) : (
        <HiOutlineBookmark />
      )}
    </Button>
  );
}
