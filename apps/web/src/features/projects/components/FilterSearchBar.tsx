import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  type FiltersFormData,
  difficultyOptions,
  filtersSchema,
  roleOptions,
  sortOptions,
  techStackOptions,
} from "../validations/filters.schema";

interface FilterItemProps {
  label: string;
  value: string | undefined;
  defaultValue: string;
  options: readonly string[];
  onSelect: (value: string) => void;
}

function FilterItem({
  label,
  value,
  defaultValue,
  options,
  onSelect,
}: FilterItemProps) {
  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger className="flex cursor-pointer flex-col rounded-full px-4 py-1 transition-colors hover:bg-gray-50">
          <span className="text-[11px] font-normal text-black/50">{label}</span>
          <span className="text-xs font-medium tracking-tight">
            {value || defaultValue}
          </span>
        </PopoverTrigger>
        <PopoverContent className="max-h-[300px] overflow-y-auto p-2">
          {options.map((option) => (
            <Button
              key={option}
              variant="ghost"
              onClick={() => onSelect(option)}
            >
              {option}
            </Button>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default function FilterSearchBar() {
  const form = useForm<FiltersFormData>({
    resolver: zodResolver(filtersSchema),
  });

  const onSubmit = (data: FiltersFormData) => {
    console.log("Form data:", data);
  };

  return (
    <div className="flex items-center justify-center">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center gap-4 rounded-full border border-black/5 bg-white px-2 py-1 shadow-md shadow-black/3 backdrop-blur-lg">
          <div className="flex items-center gap-6">
            <Image
              src="/icons/search-icon-filter.svg"
              alt="filter-search-bar"
              width={20}
              height={20}
              className="ml-2"
            />

            <div className="flex items-center">
              <div className="relative pr-4">
                <FilterItem
                  label="Filtrer par"
                  value={form.watch("techStack")}
                  defaultValue="Technologie"
                  options={techStackOptions}
                  onSelect={(value) => form.setValue("techStack", value as any)}
                />
                <div className="absolute top-1/2 right-0 h-8 -translate-y-1/2 border-r border-black/5" />
              </div>

              <div className="relative px-4">
                <FilterItem
                  label="Filtrer par"
                  value={form.watch("role")}
                  defaultValue="Role"
                  options={roleOptions}
                  onSelect={(value) => form.setValue("role", value as any)}
                />
                <div className="absolute top-1/2 right-0 h-8 -translate-y-1/2 border-r border-black/5" />
              </div>

              <div className="relative px-4">
                <FilterItem
                  label="Filtrer par"
                  value={form.watch("difficulty")}
                  defaultValue="Difficulté"
                  options={difficultyOptions}
                  onSelect={(value) =>
                    form.setValue("difficulty", value as any)
                  }
                />
                <div className="absolute top-1/2 right-0 h-8 -translate-y-1/2 border-r border-black/5" />
              </div>

              <div className="pl-4">
                <FilterItem
                  label="Trier par"
                  value={form.watch("sort")}
                  defaultValue="Plus Récent"
                  options={sortOptions}
                  onSelect={(value) => form.setValue("sort", value as any)}
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="px-4">
            Chercher un Projet
          </Button>
        </div>
      </form>
    </div>
  );
}
