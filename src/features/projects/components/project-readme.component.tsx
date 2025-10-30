"use client";

import Link from "next/link";
import { useState } from "react";
import { GoArrowUpRight } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";
import ReactMarkdown, { Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { Button } from "@/shared/components/ui/button";
import {
  readmeFullMarkdownComponents,
  readmePreviewMarkdownComponents,
} from "@/shared/components/ui/markdown-components";
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
        <div className="font-geist relative mb-14 flex h-[322px] cursor-pointer flex-col rounded-[22px] border border-black/5 bg-white p-5 transition-colors duration-300 hover:bg-black/5">
          <div className="flex-1 overflow-hidden leading-7">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={readmePreviewMarkdownComponents as Components}
            >
              {readme}
            </ReactMarkdown>
          </div>
          <div className="mt-auto">
            <Separator className="mb-6" />
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
                  <SheetTitle className="truncate text-left font-semibold">
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
                components={readmeFullMarkdownComponents as Components}
              >
                {readme}
              </ReactMarkdown>
            </div>
          </div>
          <div className="sticky bottom-0 z-50 bg-white">
            <div className="-mx-6">
              <div className="border-muted-black-stroke border-t" />
              <div className="flex items-center justify-end px-6 pt-4">
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
