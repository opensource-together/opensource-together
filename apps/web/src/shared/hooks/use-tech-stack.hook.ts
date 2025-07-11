import { useQuery } from "@tanstack/react-query";

import { ComboboxOption } from "@/shared/components/ui/combobox";

import { TechStackItem, fetchTechStacks } from "../services/tech-stack.service";

export interface TechStackOption extends ComboboxOption {
  iconUrl: string;
}

/**
 * Hook to get the tech stack options from the API
 * @returns {Object} - An object containing the tech stack options, getTechStackById, and getTechStacksByIds
 */
export function useTechStack() {
  const {
    data: techStacks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["techStacks"],
    queryFn: fetchTechStacks,
  });

  const techStackOptions: TechStackOption[] = techStacks.map((tech) => ({
    id: tech.id,
    name: tech.name,
    iconUrl: tech.iconUrl,
  }));

  const getTechStackById = (id: string): TechStackItem | null => {
    return techStacks.find((tech) => tech.id === id) || null;
  };

  const getTechStacksByIds = (ids: string[]): TechStackItem[] => {
    return ids
      .map((id) => getTechStackById(id))
      .filter((tech): tech is TechStackItem => tech !== null);
  };

  return {
    techStackOptions,
    getTechStackById,
    getTechStacksByIds,
    isLoading,
    error,
  };
}
