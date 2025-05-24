import Image from "next/image";
import React, { useRef, useState } from "react";

import { Button } from "@/components/ui/button";

const repositories = [
  { name: "Repository 1", date: "10/09/25" },
  { name: "Repository 1", date: "10/09/25" },
  { name: "Repository 1", date: "10/09/25" },
  { name: "Repository 1", date: "10/09/25" },
  { name: "Repository 1", date: "10/09/25" },
  { name: "Repository 1", date: "10/09/25" },
  { name: "Repository 1", date: "10/09/25" },
  { name: "Repository 1", date: "10/09/25" },
  { name: "Repository 1", date: "10/09/25" },
  { name: "Repository 1", date: "10/09/25" },
];

export default function StepTwo({
  onNext,
  mode,
}: {
  onNext: () => void;
  mode: "import" | "scratch";
}) {
  // Form state for scratch mode
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");

  // Scrollbar logic for import mode
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

  if (mode === "scratch") {
    return (
      <div className="font-geist flex flex-col items-center rounded-[20px] bg-white p-10">
        <h2 className="font-geist mb-2 text-[30px] font-medium text-black">
          Fill in your information
        </h2>
        <p className="mb-8 text-center text-[15px] text-black/70">
          Remplissez les informations en fonction de votre repository Github
          ci-dessous
        </p>
        <form
          className="flex w-full flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            onNext();
          }}
        >
          <div>
            <label className="font-geist mb-1 block text-[18px] font-medium tracking-tight text-black">
              Project Name
            </label>
            <input
              className="font-geist h-[40px] w-[425px] rounded-[7px] border border-black/10 px-3 py-2 text-[15px] focus:ring-2 focus:ring-black/10 focus:outline-none"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              maxLength={100}
            />
          </div>
          <div>
            <div className="mr-2 mb-1 flex items-center justify-between">
              <label className="font-geist text-[18px] font-medium tracking-tight text-black">
                Description
              </label>
              <span className="text-[10px] font-normal text-black/20">
                {description.length}/250
              </span>
            </div>
            <textarea
              className="font-geist h-[103px] w-[425px] resize-none rounded-[7px] border border-black/10 px-3 py-2 text-[15px] focus:ring-2 focus:ring-black/10 focus:outline-none"
              placeholder="Describe your project"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 250))}
              maxLength={250}
            />
          </div>
          <div>
            <label className="font-geist mb-1 block text-[18px] font-medium tracking-tight text-black">
              Link to the website
            </label>
            <input
              className="font-geist h-[40px] w-[425px] rounded-[7px] border border-black/10 px-3 py-2 text-[15px] focus:ring-2 focus:ring-black/10 focus:outline-none"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <Button
            size="lg"
            className="flex items-center justify-center"
            onClick={onNext}
          >
            Confirmer les informations
          </Button>
        </form>
      </div>
    );
  }

  // Mode import (par défaut)
  return (
    <div className="flex flex-col items-center rounded-[20px] p-10">
      <h2 className="font-geist mb-2 text-[30px] font-medium text-black">
        Importer un repository Github
      </h2>
      <p className="mb-8 text-center text-[15px] text-black/70">
        Choisissez le repository Github que vous souhaitez importer.
      </p>
      <div className="relative flex">
        <div
          ref={scrollRef}
          className="mb-4 h-[320px] w-[425px] overflow-y-auto rounded-[10px] border border-black/4 bg-black/3 pr-3"
          onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)}
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex flex-col divide-y divide-black/4">
            {repositories.map((repo, idx) => (
              <div
                key={idx}
                className="flex h-[64px] items-center justify-between bg-transparent px-6"
              >
                <div className="flex items-center gap-2">
                  <span className="font-geist text-[14px] font-normal text-black">
                    {repo.name}
                  </span>
                  <span className="ml-1 text-[14px] text-black/20">
                    <Image
                      src="/icons/lock.svg"
                      alt="lock"
                      width={14}
                      height={14}
                    />
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-geist flex-shrink-0 text-[12px] font-normal text-black/20">
                    {repo.date}
                  </span>
                  <Button size="sm">Importer</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Custom scrollbar à l'extérieur et draggable */}
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
      <div className="mt-6 flex w-full gap-2">
        <Button size="lg" className="w-full" onClick={onNext}>
          Suivant
        </Button>
      </div>
    </div>
  );
}
