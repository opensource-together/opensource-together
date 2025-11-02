"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";

import { Avatar } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";

import { useInfiniteProjects } from "../hooks/use-projects.hook";

export default function SearchCommand() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: projectsPages, isLoading } = useInfiniteProjects(
    {
      published: true,
      per_page: 20,
    },
    { enabled: open }
  );

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

  // Flatten all pages into a single array
  const allProjects =
    projectsPages?.pages?.flatMap((page) => page.data || []) ?? [];

  const suggestions = allProjects.map((project) => ({
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
        <span>Search </span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} className="rounded-2xl">
        <CommandInput placeholder="Search your next project…" />
        <CommandList className="scroll-py-0">
          {isLoading ? (
            <CommandGroup
              heading="Suggestions"
              className="space-y-2 p-0 [&_[cmdk-group-heading]]:py-1"
            >
              {[...Array(5)].map((_, i) => (
                <div key={i} className="mb-3 flex h-8 items-center gap-3 px-3">
                  <div className="bg-muted size-8 animate-pulse rounded-sm" />
                  <div className="flex-1 space-y-1">
                    <div className="bg-muted h-3 w-3/4 animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </CommandGroup>
          ) : (
            <>
              <CommandEmpty>No projects found.</CommandEmpty>
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
                    {s.iconSrc ? (
                      <Avatar
                        src={s.iconSrc}
                        name={s.name}
                        alt={s.name}
                        size="xs"
                        shape="sharp"
                      />
                    ) : (
                      <span className="text-muted-foreground">●</span>
                    )}

                    <span className="min-w-0 flex-1 truncate font-medium">
                      {s.name}
                    </span>
                    <span className="text-muted-foreground hidden max-w-[60%] truncate text-xs sm:block">
                      {s.description}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
