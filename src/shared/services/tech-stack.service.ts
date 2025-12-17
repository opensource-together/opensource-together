import { API_BASE_URL } from "@/config/config";

import type { TechStackType } from "../types/tech-stack.type";

interface TechStackApiResponse {
  data: TechStackType[];
}

/**
 * Fetch tech stacks from the API
 *
 * @returns A promise that resolves to an array of tech stack types
 */
export const fetchTechStacks = async (): Promise<TechStackType[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/techstacks`);

    if (!response.ok) {
      throw new Error("Failed to fetch tech stacks");
    }

    const data: TechStackApiResponse = await response.json();

    return data.data;
  } catch (error) {
    console.error("Error fetching tech stacks:", error);
    throw error;
  }
};
