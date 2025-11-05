"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { Button } from "@/shared/components/ui/button";
import { readmePreviewMarkdownComponents } from "@/shared/components/ui/markdown-components";

interface ContributingComponentProps {
  contributionFile: string;
}

const MAX_HEIGHT = 1000;

export default function ContributingComponent({
  contributionFile,
}: ContributingComponentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [shouldLimitHeight, setShouldLimitHeight] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkHeight = () => {
      if (contentRef.current) {
        const height = contentRef.current.scrollHeight;
        const needsReadMore = height > MAX_HEIGHT;
        setShowReadMore(needsReadMore);
        setShouldLimitHeight(needsReadMore && !isExpanded);
      }
    };

    setShouldLimitHeight(false);
    const timeoutId = setTimeout(checkHeight, 0);

    return () => clearTimeout(timeoutId);
  }, [contributionFile, isExpanded]);

  return (
    <div className="relative mb-14">
      <div
        ref={contentRef}
        className={`overflow-hidden transition-all duration-300 ${
          shouldLimitHeight && !isExpanded ? "max-h-[1000px]" : "max-h-none"
        }`}
      >
        <div className="font-geist text-sm leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={readmePreviewMarkdownComponents as Components}
          >
            {contributionFile}
          </ReactMarkdown>
        </div>
      </div>
      {showReadMore && (
        <>
          {!isExpanded && (
            <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-24 bg-gradient-to-t from-white/50 to-transparent" />
          )}
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setIsExpanded(!isExpanded);
                setShouldLimitHeight(isExpanded);
              }}
            >
              {isExpanded ? "Read less" : "Read more"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
