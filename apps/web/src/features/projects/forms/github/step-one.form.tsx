"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/ui/form";
import Icon from "@/shared/components/ui/icon";

import FormNavigationButtons from "../../components/stepper/stepper-navigation-buttons.component";
import { useProjectCreateStore } from "../../stores/project-create.store";

const repositories = [
  { name: "OpenSource Together", date: "10/09/25" },
  { name: "Gitify", date: "10/09/25" },
  { name: "Leetgrind", date: "10/09/25" },
  { name: "NextSandbox", date: "10/09/25" },
  { name: "g9s", date: "10/09/25" },
  { name: "Code Snippet", date: "10/09/25" },
  { name: "Linux", date: "10/09/25" },
  { name: "WSL", date: "10/09/25" },
];

const repositorySelectionSchema = z.object({
  selectedRepository: z
    .object({
      name: z.string(),
      date: z.string(),
    })
    .nullable(),
});

type RepositorySelectionFormData = z.infer<typeof repositorySelectionSchema>;

export default function StepOneForm() {
  const router = useRouter();
  const { selectRepository, formData } = useProjectCreateStore();

  const form = useForm<RepositorySelectionFormData>({
    resolver: zodResolver(repositorySelectionSchema),
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

  // Scrollbar logic
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartScroll, setDragStartScroll] = useState(0);

  const itemHeight = 64; // px
  const totalCount = repositories.length;
  const totalHeight = itemHeight * totalCount;
  const visibleHeight = 320;
  const scrollbarHeight = Math.max(
    (visibleHeight / totalHeight) * visibleHeight,
    40
  ); // min 40px
  const maxScrollTop = totalHeight - visibleHeight;
  const scrollbarTop =
    maxScrollTop > 0
      ? (scrollTop / maxScrollTop) * (visibleHeight - scrollbarHeight)
      : 0;

  React.useEffect(() => {
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

  const handleRepositorySelect = (repo: { name: string; date: string }) => {
    setValue("selectedRepository", repo);
  };

  const handlePrevious = () => router.push("/projects/create/github/step-one");

  const onSubmit = handleSubmit((data) => {
    if (data.selectedRepository) {
      selectRepository(data.selectedRepository);
      router.push("/projects/create/github/step-two");
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
                      {repositories.map((repo, idx) => (
                        <div
                          key={idx}
                          className={`flex h-[64px] items-center justify-between px-6 transition-colors ${
                            selectedRepository?.name === repo.name
                              ? "bg-black-50"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-black">
                              {repo.name}
                            </span>
                            <Icon name="lock" size="xs" />
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="flex-shrink-0 text-xs font-normal text-black/20">
                              {repo.date}
                            </span>
                            <Button
                              type="button"
                              variant={
                                selectedRepository?.name === repo.name
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => handleRepositorySelect(repo)}
                            >
                              {selectedRepository?.name === repo.name
                                ? "Sélectionné"
                                : "Sélectionner"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Custom scrollbar */}
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
            previousLabel="Retour"
            nextLabel="Importer"
            isLoading={isSubmitting}
            nextType="submit"
            isNextDisabled={!selectedRepository}
          />
        </div>
      </form>
    </Form>
  );
}
