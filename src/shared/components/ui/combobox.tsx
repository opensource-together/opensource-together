"use client";

import Image from "next/image";
import * as React from "react";
import { HiCheck, HiChevronDown, HiXMark } from "react-icons/hi2";
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

export interface ComboboxOption {
  id: string;
  name: string;
  iconUrl?: string;
  type?: "LANGUAGE" | "TECH";
  createdAt?: string;
  updatedAt?: string;
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
  onOpenChange?: (open: boolean) => void;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  maxSelections,
  className,
  disabled = false,
  showTags = true,
  onOpenChange,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

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
    <div
      className={cn(
        "flex w-full max-w-full flex-col gap-3 overflow-hidden",
        className
      )}
    >
      {showTags && selectedOptions.length > 0 && (
        <div className="-mb-1 flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <Badge
              key={option.id}
              variant="outline"
              className="flex items-center gap-1 border border-black/5 bg-white pr-1 font-medium text-primary text-xs"
            >
              {option.name}
              <button
                type="button"
                onClick={() => handleRemove(option.id)}
                className="flex size-3.5 cursor-pointer items-center justify-center rounded-full"
                disabled={disabled}
              >
                <HiXMark />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <Popover modal={true} open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-10 w-full min-w-0 justify-start rounded-md border-input bg-white text-start font-normal text-primary text-sm"
            disabled={disabled}
          >
            <span
              className={cn(
                "min-w-0 flex-1 truncate",
                selectedOptions.length === 0 && "text-muted-foreground"
              )}
            >
              {selectedOptions.length > 0
                ? selectedOptions.map((opt) => opt.name).join(", ")
                : placeholder}
            </span>
            <HiChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full rounded-lg p-0" align="start">
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
