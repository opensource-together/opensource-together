import React, { useState } from "react";
import { HiCheck } from "react-icons/hi2";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";

export interface SortOption {
  id: string;
  name: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { id: "most_popular", name: "Most Popular" },
  { id: "newest", name: "Newest" },
  { id: "oldest", name: "Oldest" },
  { id: "a-z", name: "A-Z" },
  { id: "z-a", name: "Z-A" },
];

interface SortSelectProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  trigger: React.ReactNode;
}

export function SortSelect({
  options,
  value,
  onChange,
  trigger,
}: SortSelectProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex w-full cursor-pointer text-start"
        >
          {trigger}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="border-muted-black-stroke p-1 shadow-xs"
        align="start"
      >
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = value === option.id;
                return (
                  <CommandItem
                    key={option.id}
                    value={option.name}
                    onSelect={() => handleSelect(option.id)}
                    className="cursor-pointer"
                  >
                    <HiCheck
                      size={16}
                      className={cn(
                        isSelected
                          ? "text-ost-blue-three opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
