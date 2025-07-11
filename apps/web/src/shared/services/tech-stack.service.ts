import { API_BASE_URL } from "@/config/config";

export interface TechStackItem {
  id: string;
  name: string;
  iconUrl: string;
}

interface TechStackApiResponse {
  id: string;
  name: string;
  iconUrl: string;
}

/**
 * Fetch tech stacks from the API
 */
export const fetchTechStacks = async (): Promise<TechStackItem[]> => {
  const response = await fetch(`${API_BASE_URL}/techstacks`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tech stacks");
  }

  const data: TechStackApiResponse[] = await response.json();
  return data.map((item) => ({
    id: item.id,
    name: item.name,
    iconUrl: item.iconUrl,
  }));
};
