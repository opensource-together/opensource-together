"use client";

import { useRouter } from "next/navigation";
import { HiBookmark, HiOutlineBookmark } from "react-icons/hi2";
import { RiLoader2Fill } from "react-icons/ri";
import { toast } from "sonner";
import useAuth from "@/features/auth/hooks/use-auth.hook";
import { Button } from "@/shared/components/ui/button";
import { getErrorMessage } from "@/shared/lib/get-error-message";

import { useProjectBookmark } from "../hooks/use-projects.hook";

interface BookmarkButtonProps {
  projectId: string;
  initialIsBookmarked?: boolean;
}

export function BookmarkButton({
  projectId,
  initialIsBookmarked = false,
}: BookmarkButtonProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { isBookmarked, toggleBookmarkAsync, isBookmarking } =
    useProjectBookmark({
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
      disabled={isBookmarking}
      aria-label={
        isBookmarking
          ? "Updating bookmark"
          : isBookmarked
            ? "Remove bookmark"
            : "Add bookmark"
      }
    >
      {isBookmarking ? (
        <RiLoader2Fill className="animate-spin" />
      ) : isBookmarked ? (
        <HiBookmark className="text-primary" />
      ) : (
        <HiOutlineBookmark />
      )}
    </Button>
  );
}
