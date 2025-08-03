"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

import Icon from "@/shared/components/ui/icon";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";

interface ProjectReadmeProps {
  readme: string;
  projectTitle: string;
}

export default function ProjectReadme({
  readme,
  projectTitle,
}: ProjectReadmeProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="font-geist relative mt-4 cursor-pointer overflow-hidden rounded-lg border border-black/5 bg-[#FDFDFD] p-5 tracking-tighter transition-colors duration-300 hover:bg-black/5">
          <div className="mb-2 flex items-center gap-2 text-base text-black">
            <Icon name="github" size="sm" variant="black" />
            <span className="text-lg font-medium">README.md</span>
          </div>
          <div className="mb-2 leading-7 text-black">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="mb-2 text-lg font-medium text-black">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mb-1 text-base font-medium text-black">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mb-1 text-base font-medium text-black">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="mb-2 text-sm text-black/70">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-2 list-disc space-y-1 pl-5 text-sm text-black/70">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-2 list-decimal space-y-1 pl-5 text-sm text-black/70">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed text-black/70">{children}</li>
                ),
                code: ({ children }) => (
                  <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-green-700">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="mb-2 overflow-x-auto rounded-lg bg-gray-100 p-3 text-xs text-black/70">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="mb-2 border-l-4 border-gray-300 pl-3 text-black/70 italic">
                    {children}
                  </blockquote>
                ),
                a: ({ children, href }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground text-sm font-medium hover:underline"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {readme?.slice(0, 300) +
                (readme && readme.length > 300 ? "..." : "")}
            </ReactMarkdown>
          </div>
          <div className="absolute right-4 bottom-3">
            <button
              className="text-muted-foreground text-sm font-medium hover:underline"
              onClick={() => setIsOpen(true)}
              type="button"
            >
              Voir plus
            </button>
          </div>
        </div>
      </SheetTrigger>
      <SheetContent
        responsive
        responsiveWidth={{ desktop: "w-[600px]" }}
        className="overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="sticky top-0 border-b border-black/10 bg-white pb-4 text-left">
            README - {projectTitle}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 max-w-none text-sm leading-relaxed">
          <ReactMarkdown
            components={{
              // Customize markdown components for better styling
              h1: ({ children }) => (
                <h1 className="mb-4 text-2xl font-bold">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="mt-6 mb-3 text-xl font-semibold">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="mt-4 mb-2 text-lg font-medium">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="mb-3 leading-relaxed">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="mb-3 list-disc space-y-1 pl-6">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-3 list-decimal space-y-1 pl-6">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed">{children}</li>
              ),
              code: ({ children }) => (
                <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="mb-3 overflow-x-auto rounded-lg bg-gray-100 p-4">
                  {children}
                </pre>
              ),
              blockquote: ({ children }) => (
                <blockquote className="mb-3 border-l-4 border-gray-300 pl-4 italic">
                  {children}
                </blockquote>
              ),
              a: ({ children, href }) => (
                <a
                  href={href}
                  className="text-blue-600 underline hover:text-blue-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
            }}
          >
            {readme}
          </ReactMarkdown>
        </div>
      </SheetContent>
    </Sheet>
  );
}
