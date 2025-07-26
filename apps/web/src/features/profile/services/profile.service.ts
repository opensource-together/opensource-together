import { API_BASE_URL } from "@/config/config";
import { safeUploadMedia, safeReplaceMedia } from "@/shared/services/media.service";

import { ProfileSchema } from "../validations/profile.schema";

export interface UpdateProfileOptions {
  data: ProfileSchema;
  avatarFile?: File;
  currentAvatarUrl?: string;
}

export const updateProfile = async ({ data, avatarFile, currentAvatarUrl }: UpdateProfileOptions) => {
  let avatarUrl = data.avatarUrl;

  // Handle avatar upload if a new file is provided
  if (avatarFile) {
    if (currentAvatarUrl) {
      // Replace existing avatar
      const newAvatarUrl = await safeReplaceMedia(currentAvatarUrl, avatarFile);
      if (newAvatarUrl) {
        avatarUrl = newAvatarUrl;
      }
    } else {
      // Upload new avatar
      const newAvatarUrl = await safeUploadMedia(avatarFile);
      if (newAvatarUrl) {
        avatarUrl = newAvatarUrl;
      }
    }
  }

  // Update profile with the new avatar URL
  const profileData = {
    ...data,
    avatarUrl,
  };

  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  return response.json();
};
