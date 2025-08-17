import { API_BASE_URL } from "@/config/config";

export interface CategoryItem {
  id: string;
  name: string;
}

interface CategoryApiResponse {
  id: string;
  name: string;
}

/**
 * Fetch categories from the API
 *
 * @returns A promise that resolves to an array of category items
 */
export const fetchCategories = async (): Promise<CategoryItem[]> => {
  const response = await fetch(`${API_BASE_URL}/categories`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data: CategoryApiResponse[] = await response.json();
  return data.map((item) => ({
    id: item.id,
    name: item.name,
  }));
};
