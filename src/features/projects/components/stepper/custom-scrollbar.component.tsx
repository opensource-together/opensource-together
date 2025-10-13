"use client";

import { useEffect, useRef, useState } from "react";

interface CustomScrollbarProps {
  height: number; // visible container height
  contentHeight: number; // total scrollable content height
  scrollTop: number; // current container scrollTop
  onScrollTopChange: (value: number) => void; // emit new scrollTop
}

export default function CustomScrollbar({
  height,
  contentHeight,
  scrollTop,
  onScrollTopChange,
}: CustomScrollbarProps) {
  const [dragging, setDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartTop, setDragStartTop] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);

  const hasOverflow = contentHeight > height;
  const safeContentHeight = contentHeight === 0 ? 1 : contentHeight;
  const scrollbarHeight = hasOverflow
    ? Math.max((height / safeContentHeight) * height, 40)
    : height;
  const maxScrollTop = Math.max(contentHeight - height, 0);
  const scrollbarTop = hasOverflow
    ? (scrollTop / maxScrollTop) * (height - scrollbarHeight)
    : 0;

  useEffect(() => {
    if (!dragging) return;
    const onMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - dragStartY;
      const newTop = Math.min(
        Math.max(dragStartTop + deltaY, 0),
        height - scrollbarHeight
      );
      const newScrollTop = (newTop / (height - scrollbarHeight)) * maxScrollTop;
      onScrollTopChange(newScrollTop);
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
    dragStartTop,
    height,
    scrollbarHeight,
    maxScrollTop,
    onScrollTopChange,
  ]);

  if (!hasOverflow) return null;

  return (
    <div
      ref={trackRef}
      style={{
        position: "absolute",
        top: 0,
        right: -18,
        width: 5,
        height,
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
          transition: dragging ? "none" : "top 0.1s",
          cursor: dragging ? "grabbing" : "grab",
        }}
        onMouseDown={(e) => {
          setDragging(true);
          setDragStartY(e.clientY);
          setDragStartTop(scrollbarTop);
        }}
      />
    </div>
  );
}
