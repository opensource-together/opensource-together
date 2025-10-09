"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/ui/form";
import { useGitRepository } from "@/shared/hooks/use-git-repository.hook";
import { UserGitRepository } from "@/shared/types/git-repository.type";

import FormNavigationButtons from "../../../components/stepper/stepper-navigation-buttons.component";
import {
  provider,
  useProjectCreateStore,
} from "../../../stores/project-create.store";
import { GithubRepoType } from "../../../types/project.type";
import {
  SelectedRepoFormData,
  selectedRepoSchema,
} from "../../../validations/project-stepper.schema";

interface StepGitImportFormProps {
  provider: provider;
}

export default function StepGitImportForm({
  provider,
}: StepGitImportFormProps) {
  const router = useRouter();
  const { selectRepository, formData } = useProjectCreateStore();

  const isScratch = provider === "scratch";
  const actualProvider = isScratch ? undefined : provider;

  const { data: gitRepos, isLoading } = useGitRepository(
    actualProvider ? { provider: actualProvider } : {}
  );

  const form = useForm<SelectedRepoFormData>({
    resolver: zodResolver(selectedRepoSchema),
    defaultValues: {
      selectedRepository: formData.selectedRepository,
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = form;

  const selectedRepository = watch("selectedRepository");

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartScroll, setDragStartScroll] = useState(0);

  const itemHeight = 64;
  const repos = actualProvider ? gitRepos?.[actualProvider]?.data || [] : [];
  const totalCount = repos.length;
  const totalHeight = itemHeight * totalCount;
  const visibleHeight = 320;
  const scrollbarHeight = Math.max(
    (visibleHeight / totalHeight) * visibleHeight,
    40
  );
  const maxScrollTop = totalHeight - visibleHeight;
  const scrollbarTop =
    maxScrollTop > 0
      ? (scrollTop / maxScrollTop) * (visibleHeight - scrollbarHeight)
      : 0;

  useEffect(() => {
    if (!dragging) return;
    const onMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - dragStartY;
      const newTop = Math.min(
        Math.max(dragStartScroll + deltaY, 0),
        visibleHeight - scrollbarHeight
      );
      const newScrollTop =
        (newTop / (visibleHeight - scrollbarHeight)) * maxScrollTop;
      if (scrollRef.current) {
        scrollRef.current.scrollTop = newScrollTop;
      }
    };
    const onMouseUp = () => setDragging(false);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [
    dragging,
    dragStartY,
    dragStartScroll,
    maxScrollTop,
    scrollbarHeight,
    visibleHeight,
  ]);

  const handleRepositorySelect = (repo: UserGitRepository) => {
    // Transform UserGitRepository to GithubRepoType format
    const transformedRepo: GithubRepoType = {
      owner: repo.name.split("/")[0] || "",
      title: repo.name,
      description: repo.description,
      url: repo.html_url,
      readme: "", // Will be fetched separately if needed
    };
    setValue("selectedRepository", transformedRepo);
  };

  const handlePrevious = () => router.push("/projects/create");

  const onSubmit = handleSubmit((data) => {
    if (data.selectedRepository) {
      selectRepository(data.selectedRepository);
      router.push(`/projects/create/${provider}/confirm`);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="w-full">
        <FormField
          control={control}
          name="selectedRepository"
          render={() => (
            <FormItem>
              <FormControl>
                <div className="relative flex w-full">
                  <div
                    ref={scrollRef}
                    className="mb-4 h-[350px] w-full overflow-y-auto rounded-md border border-black/4"
                    onScroll={(e) =>
                      setScrollTop((e.target as HTMLDivElement).scrollTop)
                    }
                    style={{ scrollbarWidth: "none" }}
                  >
                    <div className="flex flex-col divide-y divide-black/4">
                      {isLoading ? (
                        <RepositorySkeleton />
                      ) : (
                        repos?.map((repo: UserGitRepository, idx: number) => (
                          <div
                            key={idx}
                            className={`flex h-[64px] items-center justify-between px-6 transition-colors ${
                              selectedRepository?.title === repo.name
                                ? "bg-black-50"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-black">
                                {repo.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Button
                                type="button"
                                variant={
                                  selectedRepository?.title === repo.name
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => handleRepositorySelect(repo)}
                              >
                                {selectedRepository?.title === repo.name
                                  ? "Selected"
                                  : "Select"}
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: -18,
                      width: 5,
                      height: 320,
                      background: "rgba(0,0,0,0.03)",
                      borderRadius: 3,
                      zIndex: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 5,
                        height: scrollbarHeight,
                        background: "rgba(0,0,0,0.05)",
                        borderRadius: 3,
                        position: "absolute",
                        top: scrollbarTop,
                        left: 0,
                        transition: "top 0.1s",
                        cursor: "grab",
                      }}
                      onMouseDown={(e) => {
                        setDragging(true);
                        setDragStartY(e.clientY);
                        setDragStartScroll(scrollbarTop);
                      }}
                    />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4">
          <FormNavigationButtons
            onNext={onSubmit}
            onPrevious={handlePrevious}
            nextLabel="Confirm"
            isLoading={isSubmitting}
            nextType="submit"
            isNextDisabled={!selectedRepository}
          />
        </div>
      </form>
    </Form>
  );
}

export function RepositorySkeleton() {
  return Array.from({ length: 10 }).map((_, idx) => (
    <div
      key={`skeleton-${idx}`}
      className="flex h-[64px] animate-pulse items-center justify-between px-6"
    >
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-4 w-48 rounded-md bg-gray-200"></div>
        <div className="h-3 w-32 rounded-md bg-gray-200"></div>
      </div>
      <div className="h-8 w-24 rounded-md bg-gray-200"></div>
    </div>
  ));
}
