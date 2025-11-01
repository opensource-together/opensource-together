"use client";

import { useMemo, useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { CustomCombobox } from "@/shared/components/ui/custom-combobox";
import { Separator } from "@/shared/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { useLazyCategory } from "@/shared/hooks/use-lazy-category.hook";
import { useLazyTechStack } from "@/shared/hooks/use-lazy-tech-stack.hook";

import { ProjectFilters } from "../types/project-filters.type";
import { SORT_OPTIONS, SortSelect } from "./sort-select.component";

interface FilterItemProps {
  label: string;
  value: string;
}

function MobileFilterItem({ label, value }: FilterItemProps) {
  return (
    <div className="group border-muted-black-stroke flex w-full cursor-pointer flex-col rounded-full border px-6 py-3 shadow-xs">
      <span className="text-xs font-normal text-black/40">{label}</span>
      <span className="truncate text-sm font-medium tracking-tight">
        {value}
      </span>
    </div>
  );
}

interface FilterSearchBarMobileProps {
  onFilterChange?: (filters: ProjectFilters) => void;
  isLoading?: boolean;
}

export default function FilterSearchBarMobile({
  onFilterChange,
  isLoading = false,
}: FilterSearchBarMobileProps) {
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("most_popular");

  const {
    techStackOptions,
    isLoading: techStacksLoading,
    onOpenChange: onTechStackOpenChange,
  } = useLazyTechStack();
  const {
    categoryOptions,
    isLoading: categoryLoading,
    onOpenChange: onCategoryOpenChange,
  } = useLazyCategory();

  const formatSelectedValues = (
    selectedIds: string[],
    options: Array<{ id: string; name: string }>,
    defaultText: string,
    maxLength: number = 30
  ): string => {
    if (selectedIds.length === 0) return defaultText;
    const selectedNames = selectedIds
      .map((id) => options.find((opt) => opt.id === id)?.name)
      .filter((name): name is string => !!name);
    const namesText = selectedNames.join(", ");
    return namesText.length > maxLength
      ? namesText.substring(0, maxLength - 3) + "..."
      : namesText;
  };

  const techStacksValue = useMemo(
    () =>
      formatSelectedValues(
        selectedTechStacks,
        techStackOptions,
        "Technologies"
      ),
    [selectedTechStacks, techStackOptions]
  );
  const categoriesValue = useMemo(
    () =>
      formatSelectedValues(selectedCategories, categoryOptions, "Categories"),
    [selectedCategories, categoryOptions]
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
    <div className="md:hidden" role="search">
      <Sheet>
        <div className="mb-4 flex w-full items-center justify-between">
          <SheetTrigger asChild>
            <Button
              type="button"
              size="lg"
              className="w-full py-6 text-base shadow-lg"
            >
              Filter Projects
            </Button>
          </SheetTrigger>
        </div>
        <SheetContent
          side="bottom"
          responsive
          responsiveWidth={{ mobile: "w-full", desktop: "w-[420px]" }}
          className="rounded-t-2xl p-4"
        >
          <SheetHeader>
            <SheetTitle className="mx-auto h-1.5 w-12 rounded-full bg-black/10" />
          </SheetHeader>
          <div className="mt-4 flex flex-col gap-3 overflow-y-auto overscroll-contain pb-20">
            <CustomCombobox
              options={techStackOptions}
              value={selectedTechStacks}
              onChange={setSelectedTechStacks}
              placeholder={
                techStacksLoading
                  ? "Loading technologies..."
                  : "Add technologies..."
              }
              searchPlaceholder="Search technologies..."
              emptyText="No technologies found."
              trigger={
                <MobileFilterItem
                  label="Technologies"
                  value={techStacksValue}
                />
              }
              onOpenChange={onTechStackOpenChange}
              isLoading={techStacksLoading}
            />
            <CustomCombobox
              options={categoryOptions}
              value={selectedCategories}
              onChange={setSelectedCategories}
              placeholder={
                categoryLoading ? "Loading categories..." : "Add categories..."
              }
              searchPlaceholder="Search categories..."
              emptyText="No categories found."
              trigger={
                <MobileFilterItem label="Categories" value={categoriesValue} />
              }
              onOpenChange={onCategoryOpenChange}
              isLoading={categoryLoading}
            />
            <SortSelect
              options={SORT_OPTIONS}
              value={selectedSort}
              onChange={setSelectedSort}
              trigger={<MobileFilterItem label="Sort" value={sortValue} />}
            />
          </div>
          <Separator className="my-4" />
          <div className="mt-4 flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" size="lg" asChild>
              <SheetTrigger>Cancel</SheetTrigger>
            </Button>
            <Button
              type="button"
              onClick={handleApply}
              disabled={isLoading}
              size="lg"
              asChild
            >
              <SheetTrigger>Filter Projects</SheetTrigger>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
