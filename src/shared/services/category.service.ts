import { type ApiRequestContext, apiData } from "@/shared/lib/api-client";

import type { CategoryType } from "../types/category.type";

export function getCategories(
  context: ApiRequestContext = {}
): Promise<CategoryType[]> {
  return apiData<CategoryType[]>("/categories", context);
}
