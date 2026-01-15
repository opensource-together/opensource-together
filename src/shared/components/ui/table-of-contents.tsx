"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const extractedHeadings = extractHeadings(content);

    // Add chapter title as first heading if provided
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

      // Find the current active heading based on scroll position
      let currentActiveId = "";
      const scrollPosition = window.scrollY + 150; // Offset for sticky header

      // If at the top of the page, select the first heading (h1)
      if (window.scrollY < 100) {
        currentActiveId = headings[0]?.id || "";
      } else {
        // Otherwise, find the heading that's currently in view
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

    // Set initial active heading
    if (headings.length > 0) {
      setActiveId(headings[0].id);
    }

    window.addEventListener("scroll", handleScroll);
    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Offset for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="sticky top-20">
      <h3 className="mb-4 text-muted-foreground text-xs">On this page</h3>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <button
              type="button"
              onClick={() => handleClick(heading.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm transition-colors",
                heading.level === 2 && "pl-0",
                heading.level === 3 && "pl-6",
                activeId === heading.id
                  ? "bg-accent font-medium text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {activeId === heading.id && (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ost-blue-three" />
              )}
              <span className="truncate">{heading.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
