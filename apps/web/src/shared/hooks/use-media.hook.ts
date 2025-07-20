import { useQueryClient } from "@tanstack/react-query";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";

import {
  MediaUploadResponse,
  changeMedia,
  deleteMedia,
  extractMediaKey,
  uploadMedia,
} from "../services/media.service";

/**
 * Hook for uploading a new media file
 *
 * @returns An object containing:
 * - uploadMedia: function to trigger the media upload
 * - isUploading: boolean indicating if the upload is in progress
 * - isUploadError: boolean indicating if an error occurred
 */
export function useMediaUpload() {
  const queryClient = useQueryClient();

  const mutation = useToastMutation({
    mutationFn: uploadMedia,
    loadingMessage: "Upload du média en cours...",
    successMessage: "Média uploadé avec succès",
    errorMessage: "Erreur lors de l'upload du média",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["projects"] });
      },
    },
  });

  return {
    uploadMedia: mutation.mutate,
    isUploading: mutation.isPending,
    isUploadError: mutation.isError,
  };
}

/**
 * Hook for changing an existing media file
 *
 * @returns An object containing:
 * - changeMedia: function to trigger the media change
 * - isChanging: boolean indicating if the change is in progress
 * - isChangeError: boolean indicating if an error occurred
 */
export function useMediaChange() {
  const queryClient = useQueryClient();

  const mutation = useToastMutation<
    MediaUploadResponse,
    Error,
    { oldMediaUrl: string; newFile: File }
  >({
    mutationFn: ({ oldMediaUrl, newFile }) => {
      const oldKey = extractMediaKey(oldMediaUrl);
      return changeMedia(oldKey, newFile);
    },
    loadingMessage: "Changement du média en cours...",
    successMessage: "Média changé avec succès",
    errorMessage: "Erreur lors du changement du média",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["projects"] });
      },
    },
  });

  return {
    changeMedia: mutation.mutate,
    isChanging: mutation.isPending,
    isChangeError: mutation.isError,
  };
}

/**
 * Hook for deleting a media file
 *
 * @returns An object containing:
 * - deleteMedia: function to trigger the media deletion
 * - isDeleting: boolean indicating if the deletion is in progress
 * - isDeleteError: boolean indicating if an error occurred
 */
export function useMediaDelete() {
  const queryClient = useQueryClient();

  const mutation = useToastMutation<void, Error, string>({
    mutationFn: (mediaUrl: string) => {
      const key = extractMediaKey(mediaUrl);
      return deleteMedia(key);
    },
    loadingMessage: "Suppression du média en cours...",
    successMessage: "Média supprimé avec succès",
    errorMessage: "Erreur lors de la suppression du média",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["projects"] });
      },
    },
  });

  return {
    deleteMedia: mutation.mutate,
    isDeleting: mutation.isPending,
    isDeleteError: mutation.isError,
  };
}
