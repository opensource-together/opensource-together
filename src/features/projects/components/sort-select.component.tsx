import type React from "react";
import { useState } from "react";
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
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Inline accordion panel (e.g. mobile sheet) instead of floating popover */
  layout?: "popover" | "inline";
}

export function SortSelect({
  options,
  value,
  onChange,
  trigger,
  open: controlledOpen,
  onOpenChange,
  layout = "popover",
}: SortSelectProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    handleOpenChange(false);
  };

  const sortCommand = (
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
                    isSelected ? "text-ost-blue-three opacity-100" : "opacity-0"
                  )}
                />
                {option.name}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );

  if (layout === "inline") {
    return (
      <div className="flex w-full flex-col gap-2">
        <button
          type="button"
          className="group/trigger inline-flex w-full cursor-pointer text-start"
          aria-expanded={open}
          onClick={() => handleOpenChange(!open)}
        >
          {trigger}
        </button>
        {open ? (
          <div
            className={cn(
              "relative max-h-[min(40vh,16rem)] w-full origin-top overflow-y-auto overscroll-contain rounded-2xl border border-muted-black-stroke bg-popover p-1 text-popover-foreground shadow-xs",
              "fade-in-0 zoom-in-95 slide-in-from-top-2 animate-in blur-in-[6px] duration-200 ease-out"
            )}
          >
            {sortCommand}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="group/trigger inline-flex w-full cursor-pointer text-start"
        >
          {trigger}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="border-muted-black-stroke p-1 shadow-xs"
        align="start"
      >
        {sortCommand}
      </PopoverContent>
    </Popover>
  );
}
