import { useQuery } from "@tanstack/react-query";

import { ComboboxOption } from "@/shared/components/ui/combobox";

import { fetchCategories } from "../services/category.service";
import { CategoryType } from "../types/category.type";

export interface CategoryOption extends ComboboxOption {}

/**
 * Hook to get the category options from the API
 * @returns {Object} - An object containing the category options, getCategoryById, and getCategoriesByIds
 */
export function useCategories() {
  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const categoryOptions: CategoryOption[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));

  const getCategoryById = (id: string): CategoryType | null => {
    return categories.find((category) => category.id === id) || null;
  };

  const getCategoriesByIds = (ids: string[]): CategoryType[] => {
    return ids
      .map((id) => getCategoryById(id))
      .filter((category): category is CategoryType => category !== null);
  };

  return {
    categoryOptions,
    getCategoryById,
    getCategoriesByIds,
    isLoading,
    error,
  };
}
