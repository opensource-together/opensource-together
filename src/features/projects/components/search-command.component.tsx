"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";

import { Button } from "@/shared/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";

import { useProjects } from "../hooks/use-projects.hook";

export default function SearchCommand() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const projects = useProjects({ enabled: open });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  const suggestions = projects?.data?.map((project) => ({
    id: project.id,
    name: project.title,
    description: project.description,
    href: `/projects/${project.id}`,
    iconSrc: project.logoUrl,
  }));

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <HiOutlineSearch className="size-3" />
        <span>Search</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} showCloseButton={false}>
        <CommandInput placeholder="Search your next project…" />
        <CommandList className="scroll-py-0">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup
            heading="Suggestions"
            className="space-y-2 p-0 [&_[cmdk-group-heading]]:py-1"
          >
            {suggestions?.map((s) => (
              <CommandItem
                key={s.id}
                onSelect={() => handleSelect(s.href)}
                className="mb-3 h-8 px-3 py-0"
              >
                <div className="mr-0 flex size-6 items-center justify-center rounded-md text-xs">
                  {s.iconSrc ? (
                    <Image
                      src={s.iconSrc}
                      alt={s.name}
                      width={22}
                      height={22}
                    />
                  ) : (
                    <span className="text-neutral-500">●</span>
                  )}
                </div>
                <span className="min-w-0 flex-1 truncate font-medium">
                  {s.name}
                </span>
                <span className="hidden max-w-[60%] truncate text-xs text-neutral-500 sm:block">
                  {s.description}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
