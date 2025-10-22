"use client";

import * as React from "react";
import { HiCheck } from "react-icons/hi2";

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
import { TechStackType } from "@/shared/types/tech-stack.type";

import Icon from "./icon";

export interface CustomComboboxOption {
  id: string;
  name: string;
  iconUrl?: string;
  techStack?: TechStackType[];
  type?: "LANGUAGE" | "TECH";
}

interface ComboboxProps {
  options: CustomComboboxOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  maxSelections?: number;
  className?: string;
  trigger?: React.ReactNode;
  disabled?: boolean;
}

export function CustomCombobox({
  options,
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  maxSelections,
  className,
  trigger,
  disabled = false,
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

  const isMaxReached = maxSelections && value.length >= maxSelections;

  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      <Popover modal={true} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {trigger ? (
            <div
              className={cn(
                "inline-flex w-full",
                disabled && "pointer-events-none opacity-50"
              )}
            >
              {trigger}
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "text-primary border-input h-10 w-full justify-between rounded-md bg-white text-sm font-normal"
              )}
              disabled={disabled}
            >
              <span
                className={cn(
                  "truncate",
                  selectedOptions.length === 0 && "text-muted-foreground"
                )}
              >
                {selectedOptions.length > 0
                  ? `${selectedOptions.length} selected${selectedOptions.length > 1 ? "s" : ""}`
                  : placeholder}
              </span>
              <Icon name="chevron-down" />
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent
          className="border-muted-black-stroke rounded-2xl px-1 py-0 pt-2 shadow-xs"
          align="start"
        >
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              className="h-9"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            />
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
                            <HiCheck
                              size={16}
                              className={cn(
                                isSelected
                                  ? "text-ost-blue-three opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {option.iconUrl && (
                              <img
                                src={option.iconUrl}
                                alt={option.name}
                                className="size-3.5 flex-shrink-0"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            )}
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
                            <HiCheck
                              size={16}
                              className={cn(
                                isSelected
                                  ? "text-ost-blue-three opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {option.iconUrl && (
                              <img
                                src={option.iconUrl}
                                alt={option.name}
                                className="size-3.5 flex-shrink-0"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            )}
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
                        <HiCheck
                          size={16}
                          className={cn(
                            isSelected
                              ? "text-ost-blue-three opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {option.iconUrl && (
                          <img
                            src={option.iconUrl}
                            alt={option.name}
                            className="size-3.5 flex-shrink-0"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        )}
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
    </div>
  );
}
