"use client";

import Image from "next/image";
import { useState } from "react";
import { HiCheck } from "react-icons/hi2";
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
import type { TechStackType } from "@/shared/types/tech-stack.type";

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
  onOpenChange?: (open: boolean) => void;
  isLoading?: boolean;
}

export function CustomCombobox({
  options,
  value,
  onChange,
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  maxSelections,
  className,
  trigger,
  disabled = false,
  onOpenChange,
  isLoading = false,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

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
      <Popover modal={true} open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex w-full text-start",
              disabled && "pointer-events-none opacity-50"
            )}
            disabled={disabled}
            aria-disabled={disabled}
          >
            {trigger}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="relative border-muted-black-stroke p-1 shadow-xs"
          align="start"
        >
          <div className="absolute top-2.5 right-4 z-10">
            {value.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  onChange([]);
                  setOpen(false);
                }}
                className={cn(
                  "cursor-pointer text-xs underline",
                  disabled
                    ? "opacity-50"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Clear All
              </button>
            )}
          </div>
          <Command>
            <CommandInput placeholder={searchPlaceholder} className="h-9" />
            <CommandList>
              {isLoading ? (
                <CommandGroup>
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-2 py-1.5"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="h-7 w-full animate-pulse rounded-lg bg-muted" />
                      </div>
                    </div>
                  ))}
                </CommandGroup>
              ) : (
                <>
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
                                  <Image
                                    src={option.iconUrl}
                                    alt={option.name}
                                    className="size-3.5 flex-shrink-0"
                                    width={16}
                                    height={16}
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
                                  <Image
                                    src={option.iconUrl}
                                    alt={option.name}
                                    className="size-3.5 flex-shrink-0"
                                    width={16}
                                    height={16}
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
                              <Image
                                src={option.iconUrl}
                                alt={option.name}
                                className="size-3.5 flex-shrink-0"
                                width={16}
                                height={16}
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
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
