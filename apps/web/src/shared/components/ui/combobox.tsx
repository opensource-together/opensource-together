"use client";

import * as React from "react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";

import { TechStack } from "@/features/projects/types/project.type";

import Icon from "./icon";

export interface ComboboxOption {
  id: string;
  name: string;
  techStack?: TechStack[];
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  maxSelections?: number;
  className?: string;
  disabled?: boolean;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Sélectionner...",
  searchPlaceholder = "Rechercher...",
  emptyText = "Aucun résultat trouvé.",
  maxSelections,
  className,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOptions = options.filter((option) => value.includes(option.id));

  const handleSelect = (optionId: string) => {
    if (value.includes(optionId)) {
      // Remove selection
      onChange(value.filter((id) => id !== optionId));
    } else {
      // Add selection if under limit
      if (!maxSelections || value.length < maxSelections) {
        onChange([...value, optionId]);
      }
    }
  };

  const handleRemove = (optionId: string) => {
    onChange(value.filter((id) => id !== optionId));
  };

  const isMaxReached = maxSelections && value.length >= maxSelections;

  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      {/* Selected items display */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <Badge
              key={option.id}
              variant="secondary"
              className="flex items-center gap-1 bg-gray-100 pr-1 text-sm font-normal"
            >
              {option.name}
              <button
                type="button"
                onClick={() => handleRemove(option.id)}
                className="flex size-4 cursor-pointer items-center justify-center rounded-full hover:bg-gray-200"
                disabled={disabled}
              >
                <Icon name="cross" size="xxs" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Popover modal={true} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between rounded-md border-gray-300 bg-white font-normal"
            disabled={disabled}
          >
            <span className="truncate">
              {selectedOptions.length > 0
                ? `${selectedOptions.length} sélectionné${selectedOptions.length > 1 ? "s" : ""}`
                : placeholder}
            </span>
            <Icon name="chevron-down" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} className="h-9" />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = value.includes(option.id);
                  const isDisabled = !isSelected && isMaxReached;

                  return (
                    <CommandItem
                      key={option.id}
                      value={option.id}
                      onSelect={() => !isDisabled && handleSelect(option.id)}
                      className={cn(
                        "cursor-pointer",
                        isDisabled && "cursor-not-allowed opacity-50"
                      )}
                    >
                      <Icon
                        name="check"
                        size="xs"
                        variant="gray"
                        className={cn(
                          "mr-2",
                          isSelected ? "opacity-100" : "opacity-0"
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
    </div>
  );
}
