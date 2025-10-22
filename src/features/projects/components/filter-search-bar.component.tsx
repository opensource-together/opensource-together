import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { CustomCombobox } from "@/shared/components/ui/custom-combobox";
import { useCategories } from "@/shared/hooks/use-category.hook";
import { useTechStack } from "@/shared/hooks/use-tech-stack.hook";

interface FilterItemProps {
  label: string;
  value: string;
}

function FilterItem({ label, value }: FilterItemProps) {
  return (
    <div className="group flex h-12 w-37 cursor-pointer flex-col rounded-full px-8 py-2 transition-all duration-200 hover:rounded-full hover:bg-white">
      <span className="text-xs font-normal text-black/40 transition-colors duration-200">
        {label}
      </span>
      <span className="group-hover:text-primary text-xs font-medium tracking-tight whitespace-nowrap transition-colors duration-200">
        {value}
      </span>
    </div>
  );
}

export default function FilterSearchBar() {
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { techStackOptions, isLoading: techStacksLoading } = useTechStack();
  const { categoryOptions, isLoading: categoryLoading } = useCategories();

  const handleTechStacksChange = (ids: string[]) => {
    setSelectedTechStacks(ids);
  };

  const handleCategoriesChange = (ids: string[]) => {
    setSelectedCategories(ids);
  };

  return (
    <div
      className="mb-[19px] flex h-12.5 w-[592px] items-center justify-center"
      role="search"
    >
      <div className="relative flex h-full w-full items-center rounded-full border border-black/5 bg-white shadow-md shadow-black/3 backdrop-blur-lg hover:rounded-full">
        <div className="flex h-full w-full items-center rounded-full transition-colors duration-200 hover:rounded-full hover:border-black/5 hover:bg-black/5">
          <div className="flex items-center">
            <div className="relative pr-0">
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
                trigger={<FilterItem label="Choose" value="Technologies" />}
              />
            </div>

            <div className="z-10 mx-1 h-5 w-px self-center bg-black/10" />

            <div className="relative pr-0">
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
                trigger={<FilterItem label="Select" value="Categories" />}
              />
            </div>

            <div className="z-10 mx-1 h-5 w-px self-center bg-black/10" />

            <div className="relative pr-0">
              <CustomCombobox
                options={[]}
                value={[]}
                onChange={handleTechStacksChange}
                placeholder="Most Popular"
                searchPlaceholder="Sort by..."
                emptyText="No results found."
                trigger={<FilterItem label="Sort" value="Most Popular" />}
              />
            </div>
          </div>
        </div>
        <Button
          type="button"
          className="absolute right-2 px-6"
          onClick={() => {}}
        >
          Filter Projects
        </Button>
      </div>
    </div>
  );
}
