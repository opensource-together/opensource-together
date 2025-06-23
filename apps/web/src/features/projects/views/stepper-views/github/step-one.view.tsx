"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

import { Button } from "@/shared/components/ui/button";

import { StepperWrapper } from "../../../components/stepper/stepper-wrapper.component";
import { useProjectCreateStore } from "../../../store/project-create.store";

const repositories = [
  { name: "OpenSource Together", date: "10/09/25" },
  { name: "Gitify", date: "10/09/25" },
  { name: "Leetgrind", date: "10/09/25" },
  { name: "NextSandbox", date: "10/09/25" },
  { name: "g9s", date: "10/09/25" },
  { name: "Code Snippet", date: "10/09/25" },
  { name: "Open Source Together", date: "10/09/25" },
  { name: "Open Source Together", date: "10/09/25" },
  { name: "Open Source Together", date: "10/09/25" },
];

export default function StepOneView() {
  const router = useRouter();
  const { selectRepository } = useProjectCreateStore();

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

  const handleImportRepository = (repo: { name: string; date: string }) => {
    selectRepository(repo);
    router.push("/projects/create/github/step-two");
  };

  return (
    <StepperWrapper currentStep={1} method="github">
      <div className="flex flex-col items-center p-10">
        <h2 className="mb-2 text-3xl font-medium">
          Importer un repository Github
        </h2>
        <p className="mb-8 text-center text-sm text-black/70">
          Choisissez le repository Github que vous souhaitez importer.
        </p>
        <div className="relative flex">
          <div
            ref={scrollRef}
            className="mb-4 h-[320px] w-[425px] overflow-y-auto rounded-md border border-black/4 bg-black/3 pr-3"
            onScroll={(e) =>
              setScrollTop((e.target as HTMLDivElement).scrollTop)
            }
            style={{ scrollbarWidth: "none" }}
          >
            <div className="flex flex-col divide-y divide-black/4">
              {repositories.map((repo, idx) => (
                <div
                  key={idx}
                  className="flex h-[64px] items-center justify-between bg-transparent px-6"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-normal text-black">
                      {repo.name}
                    </span>
                    <span className="ml-1 text-sm text-black/20">
                      <Image
                        src="/icons/lock.svg"
                        alt="lock"
                        width={14}
                        height={14}
                      />
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 text-xs font-normal text-black/20">
                      {repo.date}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleImportRepository(repo)}
                    >
                      Importer
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
      </div>
    </StepperWrapper>
  );
}
