"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HiX } from "react-icons/hi";

import { Button } from "@/shared/components/ui/button";
import { CustomCombobox } from "@/shared/components/ui/custom-combobox";
import { Separator } from "@/shared/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { useCategories } from "@/shared/hooks/use-category.hook";
import { useTechStack } from "@/shared/hooks/use-tech-stack.hook";
import { cn } from "@/shared/lib/utils";

import type { ProjectFilters } from "../types/project-filters.type";
import { SORT_OPTIONS, SortSelect } from "./sort-select.component";

type MobileExpandedSection = "tech" | "category" | "sort" | null;

interface FilterItemProps {
  label: string;
  value: string;
}

function MobileFilterItem({ label, value }: FilterItemProps) {
  return (
    <div className="group flex w-full cursor-pointer flex-col rounded-full border border-muted-black-stroke px-6 py-3 shadow-xs">
      <span className="font-normal text-neutral-500/60 text-xs">{label}</span>
      <span className="truncate font-medium text-sm tracking-tight">
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

interface FilterSearchBarMobileProps {
  onFilterChange?: (filters: ProjectFilters) => void;
  isLoading?: boolean;
  initialFilters?: ProjectFilters;
}

export default function FilterSearchBarMobile({
  onFilterChange,
  isLoading = false,
  initialFilters,
}: FilterSearchBarMobileProps) {
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
    if (initialFilters) {
      setSelectedTechStacks(initialFilters.techStacks || []);
      setSelectedCategories(initialFilters.categories || []);
      setSelectedSort(filtersToSortId(initialFilters));
    }
  }, [initialFilters]);

  const [expandedSection, setExpandedSection] =
    useState<MobileExpandedSection>(null);

  const hasSelectedFilters = useMemo(() => {
    return (
      (initialFilters?.techStacks && initialFilters.techStacks.length > 0) ||
      (initialFilters?.categories && initialFilters.categories.length > 0)
    );
  }, [initialFilters]);

  const { techStackOptions, isLoading: techStacksLoading } = useTechStack({
    enabled: expandedSection === "tech" || hasSelectedFilters,
  });
  const { categoryOptions, isLoading: categoryLoading } = useCategories({
    enabled: expandedSection === "category" || hasSelectedFilters,
  });

  const formatSelectedValues = useCallback(
    (
      selectedIds: string[],
      options: Array<{ id: string; name: string }>,
      defaultText: string,
      _isLoading: boolean,
      maxLength = 30
    ): string => {
      if (selectedIds.length === 0) return defaultText;

      const selectedNames = selectedIds
        .map((id) => options.find((opt) => opt.id === id)?.name)
        .filter((name): name is string => !!name);

      if (selectedNames.length === 0) return defaultText;

      const namesText = selectedNames.join(", ");
      return namesText.length > maxLength
        ? `${namesText.substring(0, maxLength - 3)}...`
        : namesText;
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
    <div className="md:hidden" role="search">
      <Sheet>
        <div className="mb-4 flex w-full items-center justify-between">
          <SheetTrigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex h-14 w-full shrink-0 items-center justify-between gap-3 rounded-full border border-black/5 bg-white pr-1.5 pl-5 font-medium text-base text-foreground tracking-tight shadow-black/3 shadow-md outline-none backdrop-blur-lg transition-all",
                "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                "disabled:pointer-events-none disabled:opacity-50"
              )}
            >
              <span className="min-w-0 truncate pl-1 text-start">
                Filter Projects
              </span>
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black text-white"
                aria-hidden
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-[18px]"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                  />
                </svg>
              </span>
            </button>
          </SheetTrigger>
        </div>
        <SheetContent
          side="bottom"
          responsive
          responsiveWidth={{ mobile: "w-full", desktop: "w-[420px]" }}
          className="flex min-h-0 flex-col gap-0 rounded-t-[22px] p-4"
        >
          <div className="flex shrink-0 items-center justify-between gap-3 pt-2 pr-2 pb-2 pl-2">
            <p className="font-medium text-base text-foreground tracking-tight">
              Select Filters
            </p>
            <SheetClose asChild>
              <button
                type="button"
                className={cn(
                  "shrink-0 rounded-full border border-black/5 p-2 opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none",
                  "[&_svg]:pointer-events-none [&_svg]:shrink-0"
                )}
                aria-label="Close"
              >
                <HiX className="size-4" />
                <span className="sr-only">Close</span>
              </button>
            </SheetClose>
          </div>
          <div className="mt-2 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain">
            <CustomCombobox
              layout="inline"
              options={techStackOptions}
              value={selectedTechStacks}
              onChange={setSelectedTechStacks}
              open={expandedSection === "tech"}
              onOpenChange={(next) => setExpandedSection(next ? "tech" : null)}
              placeholder={
                techStacksLoading
                  ? "Loading technologies..."
                  : "Add technologies..."
              }
              searchPlaceholder="Search technologies..."
              emptyText="No technologies found."
              trigger={
                <MobileFilterItem label="Choose" value={techStacksValue} />
              }
              isLoading={techStacksLoading}
            />
            <CustomCombobox
              layout="inline"
              options={categoryOptions}
              value={selectedCategories}
              onChange={setSelectedCategories}
              open={expandedSection === "category"}
              onOpenChange={(next) =>
                setExpandedSection(next ? "category" : null)
              }
              placeholder={
                categoryLoading ? "Loading categories..." : "Add categories..."
              }
              searchPlaceholder="Search categories..."
              emptyText="No categories found."
              trigger={
                <MobileFilterItem label="Select" value={categoriesValue} />
              }
              isLoading={categoryLoading}
            />
            <SortSelect
              layout="inline"
              options={SORT_OPTIONS}
              value={selectedSort}
              onChange={setSelectedSort}
              open={expandedSection === "sort"}
              onOpenChange={(next) => setExpandedSection(next ? "sort" : null)}
              trigger={<MobileFilterItem label="Sort" value={sortValue} />}
            />
          </div>
          <Separator className="mt-4" contentPaddingX={4} />
          <div className="flex shrink-0 items-center justify-end gap-2 bg-background pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
            <Button type="button" variant="outline" asChild>
              <SheetTrigger>Cancel</SheetTrigger>
            </Button>
            <Button
              type="button"
              onClick={handleApply}
              disabled={isLoading}
              size="lg"
              asChild
              aria-label={
                hasPendingChanges ? "Apply Filters" : "Filter Projects"
              }
            >
              <SheetTrigger>
                <span className="grid [grid-template-areas:stack]">
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
                          (hasPendingChanges
                            ? "-translate-y-1/2"
                            : "translate-y-0")
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
              </SheetTrigger>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
