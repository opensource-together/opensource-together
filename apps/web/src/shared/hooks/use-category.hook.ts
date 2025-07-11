import { useQuery } from "@tanstack/react-query";

import { ComboboxOption } from "@/shared/components/ui/combobox";

import { CategoryItem, fetchCategories } from "../services/category.service";

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

  const getCategoryById = (id: string): CategoryItem | null => {
    return categories.find((category) => category.id === id) || null;
  };

  const getCategoriesByIds = (ids: string[]): CategoryItem[] => {
    return ids
      .map((id) => getCategoryById(id))
      .filter((category): category is CategoryItem => category !== null);
  };

  return {
    categoryOptions,
    getCategoryById,
    getCategoriesByIds,
    isLoading,
    error,
  };
}
