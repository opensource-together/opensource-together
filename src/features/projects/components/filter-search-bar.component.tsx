import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Button } from "@/shared/components/ui/button";
import { CustomCombobox } from "@/shared/components/ui/custom-combobox";
import { useCategories } from "@/shared/hooks/use-category.hook";
import { useTechStack } from "@/shared/hooks/use-tech-stack.hook";
import { cn } from "@/shared/lib/utils";

import type { ProjectFilters } from "../types/project-filters.type";
import FilterSearchBarMobile from "./filter-search-bar-mobile.component";
import { SORT_OPTIONS, SortSelect } from "./sort-select.component";

interface FilterItemProps {
  label: string;
  value: string;
  isDimmed?: boolean;
}

function FilterItem({ label, value, isDimmed = false }: FilterItemProps) {
  return (
    <div
      className={cn(
        "relative z-10 flex h-14 w-44 cursor-pointer flex-col rounded-full px-8 py-2.5 transition-opacity duration-200",
        isDimmed && "opacity-40"
      )}
    >
      <span className="font-normal text-xs text-zinc-400">{label}</span>
      <span className="truncate font-medium text-sm tracking-tight transition-colors duration-200 group-hover/trigger:text-black group-data-[state=open]/trigger:text-black">
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

function haveSameMembers(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const setA = new Set(a);
  return b.every((id) => setA.has(id));
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

  type ActiveFilter = "techStack" | "category" | "sort" | null;
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>(null);
  const [hoveredFilter, setHoveredFilter] = useState<ActiveFilter>(null);

  const isTechStackOpen = activeFilter === "techStack";
  const isCategoryOpen = activeFilter === "category";
  const isSortOpen = activeFilter === "sort";
  const anyOpen = activeFilter !== null;

  // Hover takes priority over open for blob positioning
  const effectiveTarget = hoveredFilter ?? activeFilter;

  const isTechStackDimmed =
    (hoveredFilter !== null && hoveredFilter !== "techStack") ||
    (hoveredFilter === null && anyOpen && activeFilter !== "techStack");

  const isCategoryDimmed =
    (hoveredFilter !== null && hoveredFilter !== "category") ||
    (hoveredFilter === null && anyOpen && activeFilter !== "category");

  const isSortDimmed =
    (hoveredFilter !== null && hoveredFilter !== "sort") ||
    (hoveredFilter === null && anyOpen && activeFilter !== "sort");

  const barMuted = anyOpen || hoveredFilter !== null;

  // Refs for measuring pill positions
  const pillsContainerRef = useRef<HTMLDivElement>(null);
  const techStackPillRef = useRef<HTMLDivElement>(null);
  const categoryPillRef = useRef<HTMLDivElement>(null);
  const sortPillRef = useRef<HTMLDivElement>(null);

  const [blobStyle, setBlobStyle] = useState({ translateX: 0, width: 176 });

  useLayoutEffect(() => {
    if (!effectiveTarget || !pillsContainerRef.current) return;

    const refMap: Record<
      NonNullable<ActiveFilter>,
      React.RefObject<HTMLDivElement | null>
    > = {
      techStack: techStackPillRef,
      category: categoryPillRef,
      sort: sortPillRef,
    };

    const ref = refMap[effectiveTarget];
    if (!ref.current) return;

    const containerRect = pillsContainerRef.current.getBoundingClientRect();
    const pillRect = ref.current.getBoundingClientRect();

    setBlobStyle({
      translateX: pillRect.left - containerRect.left,
      width: pillRect.width,
    });
  }, [effectiveTarget]);

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

  const handleTechStackOpenChange = (open: boolean) => {
    setActiveFilter(open ? "techStack" : null);
    if (!open) setHoveredFilter(null);
  };

  const handleCategoryOpenChange = (open: boolean) => {
    setActiveFilter(open ? "category" : null);
    if (!open) setHoveredFilter(null);
  };

  const handleSortOpenChange = (open: boolean) => {
    setActiveFilter(open ? "sort" : null);
    if (!open) setHoveredFilter(null);
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

  const hasPendingChanges = useMemo(() => {
    const appliedTech = initialFilters?.techStacks ?? [];
    const appliedCat = initialFilters?.categories ?? [];
    const appliedSortId = filtersToSortId(initialFilters);

    return (
      !haveSameMembers(selectedTechStacks, appliedTech) ||
      !haveSameMembers(selectedCategories, appliedCat) ||
      selectedSort !== appliedSortId
    );
  }, [selectedTechStacks, selectedCategories, selectedSort, initialFilters]);

  const skipInitialLabelRoll = useRef(true);
  const [labelRollAnimation, setLabelRollAnimation] = useState<
    "to-apply" | "to-idle" | null
  >(null);

  useEffect(() => {
    if (skipInitialLabelRoll.current) {
      skipInitialLabelRoll.current = false;
      return;
    }
    setLabelRollAnimation(hasPendingChanges ? "to-apply" : "to-idle");
  }, [hasPendingChanges]);

  const handleLabelRollEnd = () => {
    setLabelRollAnimation(null);
  };

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
          <div
            className={cn(
              "flex h-full w-full items-center rounded-full transition-colors duration-200",
              barMuted && "rounded-full border-black/5 bg-black/5"
            )}
          >
            <div
              ref={pillsContainerRef}
              className="group/filter-pills relative flex items-center"
            >
              {/* Sliding blob */}
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute top-0 h-full rounded-full bg-white transition-all duration-200 ease-out",
                  effectiveTarget !== null ? "opacity-100" : "opacity-0"
                )}
                style={{
                  width: blobStyle.width,
                  transform: `translateX(${blobStyle.translateX}px)`,
                }}
              />

              <div
                ref={techStackPillRef}
                onMouseEnter={() => setHoveredFilter("techStack")}
                onMouseLeave={() => setHoveredFilter(null)}
              >
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
                  trigger={
                    <FilterItem
                      label="Choose"
                      value={techStacksValue}
                      isDimmed={isTechStackDimmed}
                    />
                  }
                  open={isTechStackOpen}
                  onOpenChange={handleTechStackOpenChange}
                  isLoading={techStacksLoading}
                  modal={false}
                />
              </div>

              <div
                className={cn(
                  "z-10 mx-1 h-7 w-px shrink-0 bg-black/10 transition-opacity duration-200 ease-out",
                  effectiveTarget !== null ? "opacity-0" : "opacity-100"
                )}
                aria-hidden
              />

              <div
                ref={categoryPillRef}
                onMouseEnter={() => setHoveredFilter("category")}
                onMouseLeave={() => setHoveredFilter(null)}
              >
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
                  trigger={
                    <FilterItem
                      label="Select"
                      value={categoriesValue}
                      isDimmed={isCategoryDimmed}
                    />
                  }
                  open={isCategoryOpen}
                  onOpenChange={handleCategoryOpenChange}
                  isLoading={categoryLoading}
                  modal={false}
                />
              </div>

              <div
                className={cn(
                  "z-10 mx-1 h-7 w-px shrink-0 bg-black/10 transition-opacity duration-200 ease-out",
                  effectiveTarget !== null ? "opacity-0" : "opacity-100"
                )}
                aria-hidden
              />

              <div
                ref={sortPillRef}
                onMouseEnter={() => setHoveredFilter("sort")}
                onMouseLeave={() => setHoveredFilter(null)}
              >
                <SortSelect
                  options={SORT_OPTIONS}
                  value={selectedSort}
                  onChange={handleSortChange}
                  trigger={
                    <FilterItem
                      label="Sort"
                      value={sortValue}
                      isDimmed={isSortDimmed}
                    />
                  }
                  open={isSortOpen}
                  onOpenChange={handleSortOpenChange}
                />
              </div>
            </div>
          </div>

          <Button
            type="button"
            className="absolute right-2 px-6 py-5"
            disabled={isLoading}
            onClick={handleApply}
            aria-label={hasPendingChanges ? "Apply Filters" : "Filter Projects"}
          >
            <span className="grid [grid-template-areas:stack]">
              {/* Preserve original intrinsic width (same as plain “Filter Projects” + padding) */}
              <span
                className="invisible col-start-1 row-start-1 whitespace-nowrap [grid-area:stack]"
                aria-hidden
              >
                Filter Projects
              </span>
              <span className="relative col-start-1 row-start-1 h-5 overflow-hidden [grid-area:stack]">
                <div
                  className={cn(
                    "flex flex-col will-change-[transform,filter]",
                    labelRollAnimation === null &&
                      (hasPendingChanges ? "-translate-y-1/2" : "translate-y-0")
                  )}
                  style={
                    labelRollAnimation === "to-apply"
                      ? {
                          animation:
                            "filter-btn-label-roll-to-apply 0.28s cubic-bezier(0.25, 0.8, 0.25, 1) both",
                        }
                      : labelRollAnimation === "to-idle"
                        ? {
                            animation:
                              "filter-btn-label-roll-to-idle 0.28s cubic-bezier(0.25, 0.8, 0.25, 1) both",
                          }
                        : undefined
                  }
                  onAnimationEnd={handleLabelRollEnd}
                >
                  <span
                    className="flex h-5 shrink-0 items-center justify-center whitespace-nowrap"
                    aria-hidden
                  >
                    Filter Projects
                  </span>
                  <span
                    className="flex h-5 shrink-0 items-center justify-center whitespace-nowrap"
                    aria-hidden
                  >
                    Apply Filters
                  </span>
                </div>
              </span>
            </span>
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
