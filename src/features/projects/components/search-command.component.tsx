"use client";

import { useRouter } from "next/navigation";
import {
  type UIEvent,
  useCallback,
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { HiOutlineSearch } from "react-icons/hi";
import useAuth from "@/features/auth/hooks/use-auth.hook";
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

const MAX_FREE_PROJECTS = 60;
const ITEM_HEIGHT = 44;
const OVERSCAN_ROWS = 6;
const DEFAULT_LIST_HEIGHT = 300;
const FETCH_THRESHOLD_PX = 120;

type ProjectSuggestion = {
  id: string;
  name: string;
  description: string;
  href: string;
  iconSrc: string | null;
  searchText: string;
};

const normalizeText = (value: string) => value.trim().toLowerCase();

export default function SearchCommand() {
  const router = useRouter();
  const triggerId = useId();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [scrollTop, setScrollTop] = useState(0);
  const [listHeight, setListHeight] = useState(DEFAULT_LIST_HEIGHT);
  const { isAuthenticated } = useAuth();
  const deferredSearch = useDeferredValue(search);
  const listRef = useRef<HTMLDivElement>(null);
  const isNavigatingRef = useRef(false);

  const {
    data: projectsPages,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProjects(
    {
      published: true,
      per_page: 20,
    },
    {
      enabled: open,
      maxTotalItems: isAuthenticated ? undefined : MAX_FREE_PROJECTS,
    }
  );

  const allProjects =
    projectsPages?.pages?.flatMap((page) => page.data || []) ?? [];

  const reachedFreeCap =
    !isAuthenticated && allProjects.length >= MAX_FREE_PROJECTS;
  const projects = reachedFreeCap
    ? allProjects.slice(0, MAX_FREE_PROJECTS)
    : allProjects;

  const suggestions = useMemo<ProjectSuggestion[]>(
    () =>
      projects
        .filter((project): project is typeof project & { id: string } =>
          Boolean(project.id)
        )
        .map((project) => ({
          id: project.id,
          name: project.title,
          description: project.description ?? "",
          href: `/projects/${project.id}`,
          iconSrc: project.logoUrl,
          searchText: normalizeText(
            `${project.title} ${project.description ?? ""}`
          ),
        })),
    [projects]
  );

  const normalizedSearch = normalizeText(deferredSearch);
  const filteredSuggestions = useMemo(
    () =>
      normalizedSearch
        ? suggestions.filter((project) =>
            project.searchText.includes(normalizedSearch)
          )
        : suggestions,
    [normalizedSearch, suggestions]
  );

  const canFetchMore =
    open &&
    hasNextPage &&
    !isFetchingNextPage &&
    (isAuthenticated || !reachedFreeCap);

  const maybeFetchNextPage = useCallback(
    (element: HTMLElement) => {
      if (!canFetchMore) return;

      const distanceToBottom =
        element.scrollHeight - (element.scrollTop + element.clientHeight);

      if (distanceToBottom <= FETCH_THRESHOLD_PX) {
        fetchNextPage();
      }
    },
    [canFetchMore, fetchNextPage]
  );

  const handleListScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const element = event.currentTarget;
      setScrollTop(element.scrollTop);
      setListHeight(element.clientHeight);
      maybeFetchNextPage(element);
    },
    [maybeFetchNextPage]
  );

  useEffect(() => {
    if (
      open &&
      canFetchMore &&
      filteredSuggestions.length * ITEM_HEIGHT <=
        listHeight + FETCH_THRESHOLD_PX
    ) {
      fetchNextPage();
    }
  }, [
    open,
    canFetchMore,
    filteredSuggestions.length,
    listHeight,
    fetchNextPage,
  ]);

  useEffect(() => {
    if (!open) {
      setSearch("");
      setScrollTop(0);
      return;
    }

    const rafId = requestAnimationFrame(() => {
      if (!listRef.current) return;
      setListHeight(listRef.current.clientHeight);
      maybeFetchNextPage(listRef.current);
    });

    return () => cancelAnimationFrame(rafId);
  }, [open, maybeFetchNextPage]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    if (listRef.current.scrollTop === 0 && search.length === 0) return;
    listRef.current.scrollTop = 0;
    setScrollTop(0);
  }, [open, search]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        const triggerElement = document.getElementById(triggerId);
        if (!triggerElement || triggerElement.offsetParent === null) return;
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [triggerId]);

  const handleSelect = useCallback(
    (href: string) => {
      if (isNavigatingRef.current) return;
      isNavigatingRef.current = true;
      setOpen(false);
      queueMicrotask(() => {
        router.push(href);
      });
    },
    [router]
  );

  const handleLoginSelect = useCallback(() => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    setOpen(false);
    queueMicrotask(() => {
      router.push("/auth/login");
    });
  }, [router]);

  useEffect(() => {
    if (open) {
      isNavigatingRef.current = false;
    }
  }, [open]);

  const handleInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== "Enter") return;

      const selectedItem = listRef.current?.querySelector<HTMLElement>(
        "[cmdk-item][data-selected='true'][data-project-id]"
      );
      const projectId = selectedItem?.dataset.projectId;
      if (!projectId) return;

      const selectedProject = filteredSuggestions.find(
        (project) => project.id === projectId
      );
      if (!selectedProject) return;

      event.preventDefault();
      handleSelect(selectedProject.href);
    },
    [filteredSuggestions, handleSelect]
  );

  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN_ROWS
  );
  const visibleCount = Math.ceil(listHeight / ITEM_HEIGHT) + OVERSCAN_ROWS * 2;
  const endIndex = startIndex + visibleCount;

  return (
    <>
      <Button
        id={triggerId}
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <HiOutlineSearch className="size-3" />
        <span>Search </span>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="rounded-2xl"
        commandProps={{ shouldFilter: false }}
        dialogContentProps={{
          onCloseAutoFocus: (event) => {
            event.preventDefault();
          },
        }}
      >
        <CommandInput
          value={search}
          onValueChange={setSearch}
          onKeyDown={handleInputKeyDown}
          placeholder="Search your next project…"
        />
        <CommandList
          ref={listRef}
          className="scroll-py-0"
          onScroll={handleListScroll}
        >
          {isLoading ? (
            <CommandGroup
              heading="Suggestions"
              className="space-y-2 p-0 [&_[cmdk-group-heading]]:py-1"
            >
              {[...Array(5)].map((_, i) => (
                <div key={i} className="mb-3 flex h-11 items-center gap-3 px-3">
                  <div className="size-8 animate-pulse rounded-sm bg-muted" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </CommandGroup>
          ) : filteredSuggestions.length === 0 ? (
            <CommandEmpty>No projects found.</CommandEmpty>
          ) : (
            <CommandGroup
              heading="Suggestions"
              className="p-0 [&_[cmdk-group-heading]]:py-1"
            >
              {filteredSuggestions.map((s, index) => {
                const isVisible = index >= startIndex && index < endIndex;

                return (
                  <CommandItem
                    key={s.id}
                    value={s.name}
                    data-project-id={s.id}
                    onSelect={() => handleSelect(s.href)}
                    className="h-11 px-3 py-0"
                  >
                    {isVisible ? (
                      <>
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
                        <span className="hidden max-w-[60%] truncate text-muted-foreground text-xs sm:block">
                          {s.description}
                        </span>
                      </>
                    ) : (
                      <span className="sr-only">{s.name}</span>
                    )}
                  </CommandItem>
                );
              })}
              {canFetchMore && (
                <div className="py-2">
                  {isFetchingNextPage && (
                    <div className="flex items-center justify-center px-3">
                      <div className="flex gap-2">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="h-2 w-2 animate-pulse rounded-full bg-muted"
                            style={{
                              animationDelay: `${i * 0.2}s`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {!isAuthenticated && reachedFreeCap && (
                <CommandItem
                  onSelect={handleLoginSelect}
                  className="border-t px-3 py-3"
                >
                  <span className="font-medium text-muted-foreground text-xs">
                    Sign in to see more projects
                  </span>
                </CommandItem>
              )}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
