"use client";

import { useRouter } from "next/navigation";
import { HiBookmark, HiOutlineBookmark } from "react-icons/hi2";
import { RiLoader2Fill } from "react-icons/ri";
import { toast } from "sonner";
import { useCurrentUserQuery } from "@/features/auth/hooks/auth.queries";
import { Button } from "@/shared/components/ui/button";
import { getErrorMessage } from "@/shared/lib/get-error-message";

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

    const wasBookmarked = isBookmarked;
    try {
      const changed = await toggleBookmarkAsync();
      if (changed) {
        toast.success(
          wasBookmarked ? "Bookmark removed" : "Project bookmarked"
        );
      }
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          wasBookmarked
            ? "Failed to remove bookmark"
            : "Failed to bookmark project"
        )
      );
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
      {isPending ? (
        <RiLoader2Fill className="animate-spin" />
      ) : isBookmarked ? (
        <HiBookmark className="text-primary" />
      ) : (
        <HiOutlineBookmark />
      )}
    </Button>
  );
}
