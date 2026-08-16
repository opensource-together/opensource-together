import { useQuery } from "@tanstack/react-query";

import type { ComboboxOption } from "@/shared/components/ui/combobox";

import { getCategories } from "../services/category.service";
import type { CategoryType } from "../types/category.type";

export interface CategoryOption extends ComboboxOption {}

export function useCategories(options?: { enabled?: boolean }) {
  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: ({ signal }) => getCategories({ signal }),
    enabled: options?.enabled ?? true,
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
