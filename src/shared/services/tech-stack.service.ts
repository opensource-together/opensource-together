import { API_BASE_URL } from "@/config/config";

export interface TechStackItem {
  id: string;
  name: string;
  iconUrl: string;
  type: "LANGUAGE" | "TECH";
  createdAt: string;
  updatedAt: string;
}

interface TechStackApiResponse {
  data: TechStackItem[];
}

/**
 * Fetch tech stacks from the API
 *
 * @returns A promise that resolves to an array of tech stack items
 */
export const fetchTechStacks = async (): Promise<TechStackItem[]> => {
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
