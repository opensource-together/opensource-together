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
  type?: "LANGUAGE" | "TECH";
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
  showTags?: boolean;
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
  showTags = true,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOptions = options.filter((option) => value.includes(option.id));

  const handleSelect = (optionName: string) => {
    const option = options.find((opt) => opt.name === optionName);
    if (!option) return;

    const optionId = option.id;

    if (value.includes(optionId)) {
      onChange(value.filter((id) => id !== optionId));
    } else {
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
      <Popover modal={true} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="text-primary border-input h-10 w-full justify-between rounded-md bg-white text-sm font-normal"
            disabled={disabled}
          >
            <span
              className={cn(
                "truncate",
                selectedOptions.length === 0 && "text-muted-foreground"
              )}
            >
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
              {options.some((opt) => opt.type === "LANGUAGE") && (
                <>
                  <CommandGroup heading="Langages">
                    {options
                      .filter((opt) => opt.type === "LANGUAGE")
                      .map((option) => {
                        const isSelected = value.includes(option.id);
                        const isDisabled = !isSelected && isMaxReached;
                        return (
                          <CommandItem
                            key={option.id}
                            value={option.name}
                            onSelect={(selectedName) =>
                              !isDisabled && handleSelect(selectedName)
                            }
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
                  <CommandGroup heading="Technologies">
                    {options
                      .filter((opt) => opt.type === "TECH")
                      .map((option) => {
                        const isSelected = value.includes(option.id);
                        const isDisabled = !isSelected && isMaxReached;
                        return (
                          <CommandItem
                            key={option.id}
                            value={option.name}
                            onSelect={(selectedName) =>
                              !isDisabled && handleSelect(selectedName)
                            }
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
                </>
              )}
              {!options.some((opt) => opt.type === "LANGUAGE") && (
                <CommandGroup>
                  {options.map((option) => {
                    const isSelected = value.includes(option.id);
                    const isDisabled = !isSelected && isMaxReached;

                    return (
                      <CommandItem
                        key={option.id}
                        value={option.name}
                        onSelect={(selectedName) =>
                          !isDisabled && handleSelect(selectedName)
                        }
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
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {showTags && selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <Badge
              key={option.id}
              variant="outline"
              className="text-primary flex items-center gap-1 border border-black/5 bg-white pr-1 text-xs font-normal"
            >
              {option.name}
              <button
                type="button"
                onClick={() => handleRemove(option.id)}
                className="flex size-4 cursor-pointer items-center justify-center rounded-full"
                disabled={disabled}
              >
                <Icon name="cross" size="xxs" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
