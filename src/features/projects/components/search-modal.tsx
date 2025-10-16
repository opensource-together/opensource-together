"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";

import { mockProjectsResponse } from "@/features/projects/mocks/project.mock";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Suggestion = {
  id: string;
  name: string;
  description: string;
  href: string;
  iconSrc?: string;
};

function truncate(text?: string, max = 120): string {
  if (!text) return "";
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + "…";
}

export default function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const router = useRouter();
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const body = document.body;
    if (open) {
      body.setAttribute("data-search-modal-open", "true");
    } else {
      body.removeAttribute("data-search-modal-open");
    }
    return () => body.removeAttribute("data-search-modal-open");
  }, [open]);
  const suggestions: Suggestion[] = React.useMemo(
    () =>
      mockProjectsResponse.slice(0, 6).map((p) => ({
        id: p.id || p.title,
        name: p.title,
        description: truncate(p.description, 100) || "Open‑source project",
        href: `/projects?query=${encodeURIComponent(p.title)}`,
        iconSrc:
          (typeof p.logoUrl === "string" && p.logoUrl) ||
          (typeof p.owner?.avatarUrl === "string" && p.owner.avatarUrl) ||
          "/icons/github.svg",
      })),
    []
  );

  const handleSelect = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      showCloseButton={false}
      className="w-[525px] max-w-[525px] min-w-[525px] p-1 [&_[data-slot=command-input-wrapper]]:border-b-0"
    >
      <style jsx global>{`
        body[data-search-modal-open="true"] [data-slot="dialog-overlay"] {
          backdrop-filter: blur(2px);
          background-color: rgba(0, 0, 0, 0.35) !important;
        }
      `}</style>
      <CommandInput placeholder="Search your next project…" />
      <CommandList className="scroll-py-0">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup
          heading="Suggestions"
          className="space-y-2 p-0 [&_[cmdk-group-heading]]:py-1"
        >
          {suggestions.map((s) => (
            <CommandItem
              key={s.id}
              onSelect={() => handleSelect(s.href)}
              className="mb-3 h-8 px-3 py-0"
            >
              {/* Left: icon placeholder */}
              <div className="mr-0 flex size-6 items-center justify-center rounded-md bg-neutral-100 text-xs">
                {s.iconSrc ? (
                  <Image src={s.iconSrc} alt={s.name} width={22} height={22} />
                ) : (
                  <span className="text-neutral-500">●</span>
                )}
              </div>
              {/* Center: name */}
              <span className="min-w-0 flex-1 truncate font-medium">
                {s.name}
              </span>
              {/* Right: description */}
              <span className="hidden max-w-[60%] truncate text-xs text-neutral-500 sm:block">
                {s.description}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
