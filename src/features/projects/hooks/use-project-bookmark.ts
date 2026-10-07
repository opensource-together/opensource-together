import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { profileKeys } from "@/features/profile/hooks/profile.keys";

import {
  addProjectBookmark,
  deleteProjectBookmark,
} from "../services/project.service";
import type { Project } from "../types/project.type";
import { projectKeys, projectMutationKeys } from "./project.keys";

interface UseProjectBookmarkOptions {
  projectId: string;
  isBookmarked?: boolean;
}

export function useProjectBookmark({
  projectId,
  isBookmarked = false,
}: UseProjectBookmarkOptions) {
  const queryClient = useQueryClient();

  const bookmarkMutation = useMutation({
    mutationKey: projectMutationKeys.bookmark(),
    mutationFn: async (nextIsBookmarked: boolean) => {
      if (nextIsBookmarked) {
        await addProjectBookmark(projectId);
      } else {
        await deleteProjectBookmark(projectId);
      }
    },
    onMutate: async (nextIsBookmarked) => {
      const detailKey = projectKeys.detail(projectId);
      await queryClient.cancelQueries({ queryKey: detailKey, exact: true });
      const previous = queryClient.getQueryData<Project>(detailKey);
      queryClient.setQueryData<Project>(
        detailKey,
        (old) => old && { ...old, isBookmarked: nextIsBookmarked }
      );
      return { previous };
    },
    onError: (_error, _nextIsBookmarked, context) => {
      queryClient.setQueryData(
        projectKeys.detail(projectId),
        context?.previous
      );
    },
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: projectKeys.detail(projectId),
        }),
        queryClient.invalidateQueries({ queryKey: profileKeys.bookmarks() }),
      ]),
  });

  const isPending = bookmarkMutation.isPending;

  const toggleBookmarkAsync = useCallback(async () => {
    if (!projectId || isPending) return false;

    await bookmarkMutation.mutateAsync(!isBookmarked);

    return true;
  }, [bookmarkMutation.mutateAsync, isBookmarked, isPending, projectId]);

  return {
    isBookmarked,
    isPending,
    toggleBookmarkAsync,
  };
}
