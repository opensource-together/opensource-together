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

function resolveReadmeImageUrl(
  src: string | undefined,
  repoUrl: string | null
): string | undefined {
  if (!src) return src;
  // Keep absolute and data URIs as-is
  if (/^(https?:)?\/\//i.test(src) || src.startsWith("data:")) return src;

  if (!repoUrl) return src;

  let owner = "";
  let repo = "";
  try {
    const url = new URL(repoUrl);
    const parts = url.pathname
      .replace(/\.git$/i, "")
      .split("/")
      .filter(Boolean);
    // pathname: /owner/repo
    owner = parts[0] ?? "";
    repo = parts[1] ?? "";

    // Normalize src (remove leading ./)
    const normalized = src.replace(/^\.\//, "").replace(/^\//, "");

    if (/github\.com$/i.test(url.hostname)) {
      // https://raw.githubusercontent.com/{owner}/{repo}/HEAD/{path}
      return `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${normalized}`;
    }
    if (/gitlab\.com$/i.test(url.hostname)) {
      // https://gitlab.com/{owner}/{repo}/-/raw/HEAD/{path}
      return `${url.origin}/${owner}/${repo}/-/raw/HEAD/${normalized}`;
    }
    return src;
  } catch {
    return src;
  }
}

export default function ProjectReadme({
  readme,
  projectTitle,
  project,
}: ProjectReadmeProps) {
  const [isOpen, setIsOpen] = useState(false);

  const previewComponents: Components = {
    ...(readmePreviewMarkdownComponents as unknown as Components),
    img: ({ src, alt, width, height }) => (
      <img
        src={resolveReadmeImageUrl(
          typeof src === "string" ? src : undefined,
          project?.repoUrl
        )}
        alt={alt}
        width={width}
        height={height}
        className="border-border my-3 inline-block h-auto max-w-full rounded"
      />
    ),
    picture: ({ children }) => (
      <picture className="border-border my-3 inline-block h-auto max-w-full rounded">
        {children}
      </picture>
    ),
    source: ({ srcSet, media, ...props }) => {
      const resolvedSrcSet = srcSet
        ? srcSet
            .split(",")
            .map((src) => {
              const parts = src.trim().split(/\s+/);
              const url = parts[0];
              const descriptor = parts.slice(1).join(" ");
              const resolvedUrl = resolveReadmeImageUrl(url, project?.repoUrl);
              return descriptor ? `${resolvedUrl} ${descriptor}` : resolvedUrl;
            })
            .join(", ")
        : undefined;

      return <source srcSet={resolvedSrcSet} media={media} {...props} />;
    },
  };

  const fullComponents: Components = {
    ...(readmeFullMarkdownComponents as unknown as Components),
    img: ({ src, alt, width, height }) => (
      <img
        src={resolveReadmeImageUrl(
          typeof src === "string" ? src : undefined,
          project?.repoUrl
        )}
        alt={alt}
        width={width}
        height={height}
        className="border-border my-3 inline-block h-auto max-w-full rounded"
      />
    ),
    picture: ({ children }) => (
      <picture className="border-border my-3 inline-block h-auto max-w-full rounded">
        {children}
      </picture>
    ),
    source: ({ srcSet, media, ...props }) => {
      const resolvedSrcSet = srcSet
        ? srcSet
            .split(",")
            .map((src) => {
              const parts = src.trim().split(/\s+/);
              const url = parts[0];
              const descriptor = parts.slice(1).join(" ");
              const resolvedUrl = resolveReadmeImageUrl(url, project?.repoUrl);
              return descriptor ? `${resolvedUrl} ${descriptor}` : resolvedUrl;
            })
            .join(", ")
        : undefined;

      return <source srcSet={resolvedSrcSet} media={media} {...props} />;
    },
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="font-geist relative mb-14 flex h-[322px] cursor-pointer flex-col rounded-[22px] border border-black/5 bg-white p-5 transition-colors duration-300 hover:bg-black/5">
          <div className="flex-1 overflow-hidden leading-7">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={previewComponents}
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
                components={fullComponents}
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
