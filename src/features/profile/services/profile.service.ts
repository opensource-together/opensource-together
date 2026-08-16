import { type ApiRequestContext, apiData } from "@/shared/lib/api-client";

import type { Profile } from "../types/profile.type";
import type { UpdateProfileInput } from "../validations/profile.schema";

export function getUser(
  userId: string,
  context: ApiRequestContext = {}
): Promise<Profile> {
  return apiData<Profile>(`/users/${userId}`, context);
}

export function updateProfile(
  userId: string,
  input: UpdateProfileInput
): Promise<Profile> {
  return apiData<Profile>(`/users/${userId}`, {
    method: "PATCH",
    json: input,
  });
}

export function uploadProfileAvatar(
  userId: string,
  file: File
): Promise<Pick<Profile, "image">> {
  const formData = new FormData();
  formData.append("file", file);

  return apiData<Pick<Profile, "image">>(`/users/${userId}/logo`, {
    method: "PATCH",
    body: formData,
  });
}

export function uploadProfileBanner(
  userId: string,
  file: File
): Promise<Pick<Profile, "banner">> {
  const formData = new FormData();
  formData.append("file", file);

  return apiData<Pick<Profile, "banner">>(`/users/${userId}/banner`, {
    method: "PATCH",
    body: formData,
  });
}
