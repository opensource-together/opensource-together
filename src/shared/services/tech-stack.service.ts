import { type ApiRequestContext, apiData } from "@/shared/lib/api-client";

import type { TechStackType } from "../types/tech-stack.type";

export function getTechStacks(
  context: ApiRequestContext = {}
): Promise<TechStackType[]> {
  return apiData<TechStackType[]>("/techstacks", context);
}
