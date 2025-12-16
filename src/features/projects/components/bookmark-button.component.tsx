"use client";

import { useRouter } from "next/navigation";
import { HiBookmark, HiOutlineBookmark } from "react-icons/hi2";
import useAuth from "@/features/auth/hooks/use-auth.hook";
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
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { isBookmarked, toggleBookmark, isBookmarking } = useProjectBookmark({
    projectId,
    initialIsBookmarked,
  });

  const handleToggleBookmark = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    toggleBookmark();
  };

  return (
    <Button
      size="icon"
      variant="outline"
      className="size-9"
      onClick={handleToggleBookmark}
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
