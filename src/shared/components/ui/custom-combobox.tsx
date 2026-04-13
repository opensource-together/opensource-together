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
import {
  inlineFilterPanelEnterClass,
  inlineFilterPanelExitClass,
  useInlineFilterPanelPresence,
} from "@/shared/hooks/use-inline-filter-panel-presence.hook";
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
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isLoading?: boolean;
  modal?: boolean;
  /** Inline accordion panel (e.g. mobile sheet) instead of floating popover */
  layout?: "popover" | "inline";
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
  open: controlledOpen,
  onOpenChange,
  isLoading = false,
  modal = true,
  layout = "popover",
}: ComboboxProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen);
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

  const clearAllButton =
    value.length > 0 ? (
      <button
        type="button"
        onClick={() => {
          onChange([]);
          handleOpenChange(false);
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
    ) : null;

  const commandTree = (
    <Command>
      <CommandInput placeholder={searchPlaceholder} className="h-9" />
      <CommandList className="max-h-[288px]">
        {isLoading ? (
          <CommandGroup>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-2 px-2 py-1.5">
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
  );

  if (layout === "inline") {
    const { showPanel, isExiting } = useInlineFilterPanelPresence(open);

    return (
      <div className={cn("flex w-full flex-col gap-2", className)}>
        <button
          type="button"
          className={cn(
            "group/trigger inline-flex w-full text-start",
            disabled && "pointer-events-none opacity-50"
          )}
          disabled={disabled}
          aria-disabled={disabled}
          aria-expanded={open}
          onClick={() => !disabled && handleOpenChange(!open)}
        >
          {trigger}
        </button>
        {showPanel ? (
          <div
            className={cn(
              "relative max-h-[min(50vh,22rem)] w-full origin-top overflow-y-auto overscroll-contain rounded-2xl border border-muted-black-stroke bg-popover p-1 text-popover-foreground shadow-xs",
              isExiting
                ? inlineFilterPanelExitClass
                : inlineFilterPanelEnterClass
            )}
          >
            <div className="absolute top-2.5 right-4 z-10">
              {clearAllButton}
            </div>
            {commandTree}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      <Popover modal={modal} open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "group/trigger inline-flex w-full text-start",
              disabled && "pointer-events-none opacity-50"
            )}
            disabled={disabled}
            aria-disabled={disabled}
          >
            {trigger}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="relative w-[276px] max-w-[276px] border-muted-black-stroke p-1 shadow-xs"
          align="start"
        >
          <div className="absolute top-2.5 right-4 z-10">{clearAllButton}</div>
          {commandTree}
        </PopoverContent>
      </Popover>
    </div>
  );
}
