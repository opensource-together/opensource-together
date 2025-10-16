"use client";

import Link from "next/link";
import { useState } from "react";
import { GoArrowUpRight } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
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
  project: {
    repoUrl: string | null;
  };
}

export default function ProjectReadme({
  readme,
  projectTitle,
  project,
}: ProjectReadmeProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="font-geist relative mt-8 flex h-[322px] cursor-pointer flex-col rounded-[22px] border border-black/5 bg-white p-5 transition-colors duration-300 hover:bg-black/5">
          <div className="mb-2 flex-1 overflow-hidden leading-7">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
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
                  <code className="bg-accent rounded px-1 py-0.5 font-mono text-xs text-green-700">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-accent mb-2 overflow-x-auto rounded-lg p-3 text-xs text-black/70">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="mb-2 border-l-4 border-gray-300 pl-3 text-black/70 italic">
                    {children}
                  </blockquote>
                ),
                a: ({ children }) => (
                  <span
                    className="text-muted-foreground pointer-events-none cursor-default text-sm font-medium select-text"
                    aria-disabled
                  >
                    {children}
                  </span>
                ),
                img: ({ src, alt, width, height }) => (
                  <img
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    className="h-auto max-w-full rounded"
                  />
                ),
                table: ({ children }) => (
                  <div className="mb-2 overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="bg-accent border border-gray-300 px-3 py-2 text-left text-sm font-medium">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-gray-300 px-3 py-2 text-sm">
                    {children}
                  </td>
                ),
              }}
            >
              {readme}
            </ReactMarkdown>
          </div>
          <div className="mt-auto">
            <Separator className="my-6" />
            <span className="flex items-center text-sm font-medium">
              View README
              <GoArrowUpRight className="mt-0.5 ml-1 size-4" />
            </span>
          </div>
        </div>
      </SheetTrigger>
      <SheetContent
        responsive
        responsiveWidth={{ desktop: "w-[540px]" }}
        className="mt-4 mr-4 overflow-y-auto rounded-t-[22px] md:h-[97vh] md:rounded-[22px]"
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="sticky top-0 z-50 bg-white">
            <div className="-mx-6">
              <div className="px-6 pb-4">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-left font-semibold">
                    README - {projectTitle}
                  </SheetTitle>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                  >
                    <RxCross2 size={12} />
                  </Button>
                </div>
              </div>
              <div className="border-muted-black-stroke border-b" />
            </div>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            <div className="font-geist my-6 max-w-none text-sm leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="mb-4 text-2xl font-semibold">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="mt-6 mb-3 text-xl font-semibold">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="mt-4 mb-2 text-lg font-medium">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-3 leading-relaxed">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-3 list-disc space-y-1 pl-6">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-3 list-decimal space-y-1 pl-6">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed">{children}</li>
                  ),
                  code: ({ children }) => (
                    <code className="bg-accent rounded px-1 py-0.5 font-mono text-sm">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-accent mb-3 overflow-x-auto rounded-lg p-4">
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
                      className="text-ost-blue-three hover:text-ost-blue-four underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  img: ({ src, alt, width, height }) => (
                    <img
                      src={src}
                      alt={alt}
                      width={width}
                      height={height}
                      className="my-3 h-auto max-w-full rounded"
                    />
                  ),
                  table: ({ children }) => (
                    <div className="mb-3 overflow-x-auto">
                      <table className="min-w-full border-collapse border border-gray-300">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="bg-accent border border-gray-300 px-3 py-2 text-left text-sm font-medium">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-gray-300 px-3 py-2 text-sm">
                      {children}
                    </td>
                  ),
                }}
              >
                {readme}
              </ReactMarkdown>
            </div>
          </div>
          <div className="sticky bottom-0 z-50 bg-white">
            <div className="-mx-6">
              <div className="border-muted-black-stroke border-t" />
              <div className="flex items-center justify-end gap-4 px-6 pt-4">
                <Button variant="secondary" onClick={() => setIsOpen(false)}>
                  Back
                </Button>
                {(() => {
                  const sourceUrl = project?.repoUrl || "";
                  const isGitHub = /github\.com/i.test(sourceUrl);
                  const isGitLab = /gitlab\.com/i.test(sourceUrl);
                  const label = isGitHub
                    ? "GitHub"
                    : isGitLab
                      ? "GitLab"
                      : "Repository";
                  return (
                    <Button variant="default" asChild>
                      <Link
                        href={sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View on {label}
                        <GoArrowUpRight className="mt-0.5 size-4" />
                      </Link>
                    </Button>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
