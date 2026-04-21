"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  chapterTitle?: string;
}

function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match: RegExpExecArray | null = null;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    headings.push({ id, text, level });
  }

  return headings;
}

export function TableOfContents({
  content,
  chapterTitle,
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const [barStyle, setBarStyle] = useState<React.CSSProperties>({
    opacity: 0,
    height: 0,
    transform: "translateY(0px)",
  });
  const isFirstActiveRef = useRef(true);

  useEffect(() => {
    const extractedHeadings = extractHeadings(content);

    if (chapterTitle) {
      const titleId = chapterTitle
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      setHeadings([
        { id: titleId, text: chapterTitle, level: 1 },
        ...extractedHeadings,
      ]);
    } else {
      setHeadings(extractedHeadings);
    }
  }, [content, chapterTitle]);

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map((h) => ({
        id: h.id,
        element: document.getElementById(h.id),
      }));

      let currentActiveId = "";
      const scrollPosition = window.scrollY + 150;

      if (window.scrollY < 100) {
        currentActiveId = headings[0]?.id || "";
      } else {
        for (let i = headingElements.length - 1; i >= 0; i--) {
          const { id, element } = headingElements[i];
          if (element && element.offsetTop <= scrollPosition) {
            currentActiveId = id;
            break;
          }
        }
      }

      setActiveId(currentActiveId);
    };

    if (headings.length > 0) {
      setActiveId(headings[0].id);
    }

    window.addEventListener("scroll", handleScroll);
    const timeoutId = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [headings]);

  // Reposition the bar whenever the active item changes
  useEffect(() => {
    if (!activeId) return;
    const nav = navRef.current;
    const list = listRef.current;
    const item = itemRefs.current.get(activeId);
    if (!nav || !list || !item) return;

    const navRect = nav.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    // Account for the list's scroll offset
    const y = itemRect.top - navRect.top + list.scrollTop;

    if (isFirstActiveRef.current) {
      isFirstActiveRef.current = false;
      setBarStyle({
        opacity: 1,
        height: itemRect.height,
        transform: `translateY(${y}px)`,
        transition: "opacity 150ms ease-out",
      });
    } else {
      setBarStyle({
        opacity: 1,
        height: itemRect.height,
        transform: `translateY(${y}px)`,
        transition:
          "transform 280ms cubic-bezier(0.22,1,0.36,1), height 280ms cubic-bezier(0.22,1,0.36,1), opacity 150ms ease-out",
      });
    }
  }, [activeId]);

  if (headings.length === 0) {
    return null;
  }

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      ref={navRef}
      className="relative sticky top-28 flex max-h-[calc(100dvh-9rem)] flex-col overscroll-contain"
    >
      {/* grey track */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 h-full w-[2px] rounded-full bg-neutral-100"
      />
      {/* sliding active indicator */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 w-[2px] rounded-full bg-foreground"
        style={barStyle}
      />
      <ul
        ref={listRef}
        className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-0.5 pl-3"
      >
        {headings.map((heading) => (
          <li
            key={heading.id}
            ref={(el) => {
              if (el) itemRefs.current.set(heading.id, el);
              else itemRefs.current.delete(heading.id);
            }}
          >
            <button
              type="button"
              onClick={() => handleClick(heading.id)}
              className={cn(
                "flex w-full cursor-pointer items-center rounded-md py-1.5 pr-3 pl-0 text-left transition-colors duration-200 ease-out",
                "text-xs",
                heading.level === 3 && "pl-4",
                activeId === heading.id
                  ? "font-normal text-foreground"
                  : "font-normal text-neutral-500 hover:text-foreground"
              )}
            >
              <span className="truncate tracking-normal">{heading.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
