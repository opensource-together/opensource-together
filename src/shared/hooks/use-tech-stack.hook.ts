import { useQuery } from "@tanstack/react-query";

import { ComboboxOption } from "@/shared/components/ui/combobox";

import { fetchTechStacks } from "../services/tech-stack.service";
import { TechStackType } from "../types/tech-stack.type";

export type TechStackOption = ComboboxOption;

/**
 * Hook to get the tech stack options from the API
 * @param options - Optional query options (e.g., enabled)
 * @returns {Object} - An object containing the tech stack options, getTechStackById, and getTechStacksByIds
 */
export function useTechStack(options?: { enabled?: boolean }) {
  const {
    data: techStacks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["techStacks"],
    queryFn: fetchTechStacks,
    enabled: options?.enabled ?? true,
  });

  const languageOptions: TechStackOption[] = techStacks
    .filter((tech) => tech.type === "LANGUAGE")
    .map((tech) => ({
      id: tech.id,
      name: tech.name,
      iconUrl: tech.iconUrl,
      type: tech.type,
      createdAt: tech.createdAt,
      updatedAt: tech.updatedAt,
    }));

  const technologyOptions: TechStackOption[] = techStacks
    .filter((tech) => tech.type === "TECH")
    .map((tech) => ({
      id: tech.id,
      name: tech.name,
      iconUrl: tech.iconUrl,
      type: tech.type,
      createdAt: tech.createdAt,
      updatedAt: tech.updatedAt,
    }));

  const techStackOptions: TechStackOption[] = [
    ...languageOptions,
    ...technologyOptions,
  ];

  const getTechStackById = (id: string): TechStackType | null => {
    return techStacks.find((tech) => tech.id === id) || null;
  };

  const getTechStacksByIds = (ids: string[]): TechStackType[] => {
    return ids
      .map((id) => getTechStackById(id))
      .filter((tech): tech is TechStackType => tech !== null);
  };

  return {
    techStackOptions,
    languageOptions,
    technologyOptions,
    getTechStackById,
    getTechStacksByIds,
    isLoading,
    error,
  };
}
