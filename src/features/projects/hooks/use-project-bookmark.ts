import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { profileKeys } from "@/features/profile/hooks/profile.keys";

import {
  bookmarkProject,
  removeProjectBookmark,
} from "../services/project.service";
import { projectKeys, projectMutationKeys } from "./project.keys";

interface UseProjectBookmarkOptions {
  projectId: string;
  initialIsBookmarked?: boolean;
}

export function useProjectBookmark({
  projectId,
  initialIsBookmarked = false,
}: UseProjectBookmarkOptions) {
  const queryClient = useQueryClient();
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);

  useEffect(() => {
    setIsBookmarked(initialIsBookmarked);
  }, [initialIsBookmarked]);

  const bookmarkMutation = useMutation({
    mutationKey: projectMutationKeys.bookmark(),
    mutationFn: () => bookmarkProject(projectId),
    onSuccess: async () => {
      setIsBookmarked(true);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: projectKeys.detail(projectId),
        }),
        queryClient.invalidateQueries({ queryKey: profileKeys.bookmarks() }),
      ]);
    },
  });

  const removeBookmarkMutation = useMutation({
    mutationKey: projectMutationKeys.removeBookmark(),
    mutationFn: () => removeProjectBookmark(projectId),
    onSuccess: async () => {
      setIsBookmarked(false);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: projectKeys.detail(projectId),
        }),
        queryClient.invalidateQueries({ queryKey: profileKeys.bookmarks() }),
      ]);
    },
  });

  const isPending =
    bookmarkMutation.isPending || removeBookmarkMutation.isPending;

  const toggleBookmarkAsync = useCallback(async () => {
    if (!projectId || isPending) return false;

    if (isBookmarked) {
      await removeBookmarkMutation.mutateAsync();
    } else {
      await bookmarkMutation.mutateAsync();
    }

    return true;
  }, [
    bookmarkMutation.mutateAsync,
    isBookmarked,
    isPending,
    projectId,
    removeBookmarkMutation.mutateAsync,
  ]);

  return {
    isBookmarked,
    isPending,
    toggleBookmarkAsync,
  };
}
