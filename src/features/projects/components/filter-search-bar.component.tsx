import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { CustomCombobox } from "@/shared/components/ui/custom-combobox";
import { useCategories } from "@/shared/hooks/use-category.hook";
import { useTechStack } from "@/shared/hooks/use-tech-stack.hook";

import type { ProjectFilters } from "../types/project-filters.type";
import FilterSearchBarMobile from "./filter-search-bar-mobile.component";
import { SORT_OPTIONS, SortSelect } from "./sort-select.component";

interface FilterItemProps {
  label: string;
  value: string;
}

function FilterItem({ label, value }: FilterItemProps) {
  return (
    <div className="group flex h-14 w-44 cursor-pointer flex-col rounded-full px-8 py-2.5 transition-all duration-200 hover:rounded-full hover:bg-white">
      <span className="font-normal text-black/40 text-xs transition-colors duration-200">
        {label}
      </span>
      <span className="truncate font-medium text-sm tracking-tight transition-colors duration-200 group-hover:text-black">
        {value}
      </span>
    </div>
  );
}

/**
 * Converts ProjectFilters to sort option ID
 */
function filtersToSortId(filters?: ProjectFilters): string {
  if (!filters) return "most_popular";

  const { orderBy, orderDirection } = filters;

  if (orderBy === "trending" && orderDirection === "desc") {
    return "most_popular";
  }
  if (orderBy === "createdAt" && orderDirection === "desc") {
    return "newest";
  }
  if (orderBy === "createdAt" && orderDirection === "asc") {
    return "oldest";
  }
  if (orderBy === "title" && orderDirection === "asc") {
    return "a-z";
  }
  if (orderBy === "title" && orderDirection === "desc") {
    return "z-a";
  }

  return "most_popular";
}

interface FilterSearchBarProps {
  onFilterChange?: (filters: ProjectFilters) => void;
  isLoading?: boolean;
  initialFilters?: ProjectFilters;
}

export default function FilterSearchBar({
  onFilterChange,
  isLoading = false,
  initialFilters,
}: FilterSearchBarProps) {
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>(
    initialFilters?.techStacks || []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialFilters?.categories || []
  );
  const [selectedSort, setSelectedSort] = useState<string>(
    filtersToSortId(initialFilters)
  );

  useEffect(() => {
    if (!initialFilters) return;

    setSelectedTechStacks(initialFilters.techStacks || []);
    setSelectedCategories(initialFilters.categories || []);
    setSelectedSort(filtersToSortId(initialFilters));
  }, [initialFilters]);

  const [isTechStackOpen, setIsTechStackOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const hasSelectedFilters = useMemo(() => {
    return (
      (initialFilters?.techStacks?.length ?? 0) > 0 ||
      (initialFilters?.categories?.length ?? 0) > 0
    );
  }, [initialFilters]);

  const { techStackOptions, isLoading: techStacksLoading } = useTechStack({
    enabled: isTechStackOpen || hasSelectedFilters,
  });

  const { categoryOptions, isLoading: categoryLoading } = useCategories({
    enabled: isCategoryOpen || hasSelectedFilters,
  });

  const handleTechStacksChange = (ids: string[]) => {
    setSelectedTechStacks(ids);
  };

  const handleCategoriesChange = (ids: string[]) => {
    setSelectedCategories(ids);
  };

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
  };

  const formatSelectedValues = useCallback(
    (
      selectedIds: string[],
      options: Array<{ id: string; name: string }>,
      defaultText: string,
      isLoading: boolean,
      maxLength = 30
    ): string => {
      if (selectedIds.length === 0) return defaultText;
      if (isLoading) return "Loading...";

      const selectedNames = selectedIds
        .map((id) => options.find((opt) => opt.id === id)?.name)
        .filter((name): name is string => Boolean(name));

      if (selectedNames.length === 0) return defaultText;

      const namesText = selectedNames.join(", ");

      if (namesText.length > maxLength) {
        return `${namesText.slice(0, maxLength - 3)}...`;
      }

      return namesText;
    },
    []
  );

  const techStacksValue = useMemo(
    () =>
      formatSelectedValues(
        selectedTechStacks,
        techStackOptions,
        "Technologies",
        techStacksLoading
      ),
    [
      selectedTechStacks,
      techStackOptions,
      techStacksLoading,
      formatSelectedValues,
    ]
  );

  const categoriesValue = useMemo(
    () =>
      formatSelectedValues(
        selectedCategories,
        categoryOptions,
        "Categories",
        categoryLoading
      ),
    [selectedCategories, categoryOptions, categoryLoading, formatSelectedValues]
  );

  const sortValue = useMemo(() => {
    return (
      SORT_OPTIONS.find((opt) => opt.id === selectedSort)?.name ||
      "Most Popular"
    );
  }, [selectedSort]);

  const getSortParams = () => {
    switch (selectedSort) {
      case "most_popular":
        return {
          orderBy: "trending" as const,
          orderDirection: "desc" as const,
        };
      case "newest":
        return {
          orderBy: "createdAt" as const,
          orderDirection: "desc" as const,
        };
      case "oldest":
        return {
          orderBy: "createdAt" as const,
          orderDirection: "asc" as const,
        };
      case "a-z":
        return { orderBy: "title" as const, orderDirection: "asc" as const };
      case "z-a":
        return { orderBy: "title" as const, orderDirection: "desc" as const };
      default:
        return {
          orderBy: "createdAt" as const,
          orderDirection: "desc" as const,
        };
    }
  };

  const handleApply = () => {
    if (!onFilterChange) return;

    const sortParams = getSortParams();

    onFilterChange({
      techStacks: selectedTechStacks,
      categories: selectedCategories,
      orderBy: sortParams.orderBy,
      orderDirection: sortParams.orderDirection,
    });
  };

  return (
    <>
      <div
        className="hidden h-14 w-[700px] items-center justify-center md:flex"
        role="search"
      >
        <div className="relative flex h-full w-full items-center rounded-full border border-black/5 bg-white shadow-black/3 shadow-md backdrop-blur-lg hover:rounded-full">
          <div className="flex h-full w-full items-center rounded-full transition-colors duration-200 hover:rounded-full hover:border-black/5 hover:bg-black/5">
            <div className="flex items-center">
              <CustomCombobox
                options={techStackOptions}
                value={selectedTechStacks}
                onChange={handleTechStacksChange}
                placeholder={
                  techStacksLoading
                    ? "Loading technologies..."
                    : "Add technologies..."
                }
                searchPlaceholder="Search technologies..."
                emptyText="No technologies found."
                trigger={<FilterItem label="Choose" value={techStacksValue} />}
                onOpenChange={setIsTechStackOpen}
                isLoading={techStacksLoading}
              />

              <div className="z-10 mx-1 h-7 w-px bg-black/10" />

              <CustomCombobox
                options={categoryOptions}
                value={selectedCategories}
                onChange={handleCategoriesChange}
                placeholder={
                  categoryLoading
                    ? "Loading categories..."
                    : "Add categories..."
                }
                searchPlaceholder="Search categories..."
                emptyText="No categories found."
                trigger={<FilterItem label="Select" value={categoriesValue} />}
                onOpenChange={setIsCategoryOpen}
                isLoading={categoryLoading}
              />

              <div className="z-10 mx-1 h-7 w-px bg-black/10" />

              <SortSelect
                options={SORT_OPTIONS}
                value={selectedSort}
                onChange={handleSortChange}
                trigger={<FilterItem label="Sort" value={sortValue} />}
              />
            </div>
          </div>

          <Button
            type="button"
            className="absolute right-2 px-6 py-5"
            disabled={isLoading}
            onClick={handleApply}
          >
            Filter Projects
          </Button>
        </div>
      </div>

      <FilterSearchBarMobile
        onFilterChange={onFilterChange}
        isLoading={isLoading}
        initialFilters={initialFilters}
      />
    </>
  );
}
