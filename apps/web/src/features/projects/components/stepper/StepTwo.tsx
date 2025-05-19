import React, { useRef, useState } from "react";
import Button from "@/shared/ui/Button";
import Image from "next/image";
import lockIcon from "@/shared/icons/lock.svg";

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

export default function StepTwo({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartScroll, setDragStartScroll] = useState(0);
  const itemHeight = 64; // px
  const totalCount = repositories.length;
  const totalHeight = itemHeight * totalCount;
  const visibleHeight = 320;
  const scrollbarHeight = Math.max((visibleHeight / totalHeight) * visibleHeight, 40); // min 40px
  const maxScrollTop = totalHeight - visibleHeight;
  const scrollbarTop = maxScrollTop > 0 ? (scrollTop / maxScrollTop) * (visibleHeight - scrollbarHeight) : 0;

  // Drag logic
  React.useEffect(() => {
    if (!dragging) return;
    const onMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - dragStartY;
      const newTop = Math.min(
        Math.max(dragStartScroll + deltaY, 0),
        visibleHeight - scrollbarHeight
      );
      const newScrollTop = (newTop / (visibleHeight - scrollbarHeight)) * maxScrollTop;
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
  }, [dragging, dragStartY, dragStartScroll, maxScrollTop, scrollbarHeight, visibleHeight]);

  return (
    <div className="flex flex-col items-center p-10 rounded-[20px] ">
      <h2 className="text-black font-geist font-medium text-[30px] mb-2">Import Github Repository</h2>
      <p className="text-[15px] text-black/70 mb-8 text-center">
        Choose which Github repository you want to import.
      </p>
      <div className="relative flex">
        <div
          ref={scrollRef}
          className="bg-black/3 w-[425px] h-[320px] rounded-[10px] border border-black/4 mb-4 overflow-y-auto pr-3"
          onScroll={e => setScrollTop((e.target as HTMLDivElement).scrollTop)}
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex flex-col divide-y divide-black/4">
            {repositories.map((repo, idx) => (
              <div key={idx} className="flex items-center justify-between h-[64px] px-6 bg-transparent">
                <div className="flex items-center gap-2">
                  <span className="font-geist font-normal text-[14px] text-black">{repo.name}</span>
                  <span className="text-black/20 text-[14px] ml-1"><Image src={lockIcon} alt="lock" width={14} height={14} /></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-geist font-normal text-[12px] text-black/20 flex-shrink-0">{repo.date}</span>
                  <Button
                    width="73px"
                    height="28px"
                    radius="7px"
                    minWidth={false}
                    className="text-[12px] font-geist font-medium"
                  >
                    Import
                  </Button>
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
            onMouseDown={e => {
              setDragging(true);
              setDragStartY(e.clientY);
              setDragStartScroll(scrollbarTop);
            }}
          />
        </div>
      </div>
      <div className="flex gap-2 mt-6">
        <Button
          width="425px"
          height="43px"
          radius="10px"
          className="flex items-center justify-center text-[15px]"
          onClick={onNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
} 