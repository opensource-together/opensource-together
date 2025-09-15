import { API_BASE_URL } from "@/config/config";

export interface TechStackItem {
  id: string;
  name: string;
  iconUrl: string;
  type: "LANGUAGE" | "TECH";
}

interface TechStackApiGroupResponse {
  languages: TechStackItem[];
  technologies: TechStackItem[];
}

/**
 * Fetch tech stacks from the API
 *
 * @returns A promise that resolves to an array of tech stack items
 */
export const fetchTechStacks = async (): Promise<TechStackItem[]> => {
  const response = await fetch(`${API_BASE_URL}/techstacks`);

  if (!response.ok) {
    throw new Error("Failed to fetch tech stacks");
  }

  const data: TechStackApiGroupResponse = await response.json();

  return [
    ...data.languages.map((item) => ({
      ...item,
      type: "LANGUAGE" as const,
    })),
    ...data.technologies.map((item) => ({
      ...item,
      type: "TECH" as const,
    })),
  ];
};
