import { API_BASE_URL } from "@/config/config";

import { ProfileSchema } from "../validations/profile.schema";

export const updateProfile = async (data: ProfileSchema) => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  return response.json();
};
