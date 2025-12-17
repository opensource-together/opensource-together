import { API_BASE_URL } from "@/config/config";

import type { CategoryType } from "../types/category.type";

interface CategoryApiResponse {
  data: CategoryType[];
}

/**
 * Fetch categories from the API
 *
 * @returns A promise that resolves to an array of category items
 */
export const fetchCategories = async (): Promise<CategoryType[]> => {
  const response = await fetch(`${API_BASE_URL}/categories`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data: CategoryApiResponse = await response.json();

  return data.data;
};
