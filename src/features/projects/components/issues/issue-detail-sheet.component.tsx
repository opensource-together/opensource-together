"use client";

import Link from "next/link";
import { useState } from "react";
import { GoArrowUpRight } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";
import { VscIssues } from "react-icons/vsc";
import ReactMarkdown, { Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { Avatar } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { ErrorState } from "@/shared/components/ui/error-state";
import { issueMarkdownComponents } from "@/shared/components/ui/markdown-components";
import { Separator } from "@/shared/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import { formatTimeAgo } from "@/shared/lib/utils/format-time-ago";

import { Issue } from "@/features/projects/types/project.type";

import { useOpenIssueDetail } from "../../hooks/use-open-issue-detail";

interface IssueDetailSheetProps {
  issue: Issue;
  projectId: string;
  className?: string;
  children?: React.ReactNode;
}

function extractNumberFromUrl(url: string): string | null {
  const match = url.match(/\/(\d+)(?:$|#|\?)/);
  return match?.[1] ?? null;
}

// Reusable Sheet Header component
function SheetHeaderContent({
  number,
  title,
  onClose,
}: {
  number: string | null;
  title: string;
  onClose: () => void;
}) {
  return (
    <SheetHeader className="sticky top-0 z-50 bg-white">
      <div className="-mx-6">
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-left font-medium">
              <Badge variant="info" className="py-1 text-sm">
                <VscIssues />#{number}
              </Badge>
              <span className="line-clamp-1 text-sm font-medium tracking-tight">
                {title}
              </span>
            </SheetTitle>
            <Button size="icon" variant="ghost" onClick={onClose}>
              <RxCross2 size={12} />
            </Button>
          </div>
        </div>
        <div className="border-muted-black-stroke border-b" />
      </div>
    </SheetHeader>
  );
}

function IssueDetailSkeleton() {
  return (
    <div className="my-5 max-w-none">
      {/* Issue Meta Skeleton */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div>
            <Skeleton className="mb-1 h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Issue Body Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export default function IssueDetailSheet({
  issue,
  projectId,
  children,
}: IssueDetailSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const number = extractNumberFromUrl(issue.url);

  const {
    data: issueDetails,
    isLoading,
    isError,
  } = useOpenIssueDetail(projectId, parseInt(number || "0"), isOpen);

  const displayIssue = issueDetails || issue;

  // Callback functions
  const handleClose = () => setIsOpen(false);

  if (isLoading) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent
          responsive
          responsiveWidth={{ desktop: "w-[540px]" }}
          className="mt-4 mr-4 overflow-y-auto rounded-t-[22px] md:h-[97vh] md:rounded-[22px]"
        >
          <div className="flex h-full flex-col">
            <SheetHeaderContent
              number={number}
              title={displayIssue.title}
              onClose={handleClose}
            />
            <div className="flex-1 overflow-y-auto">
              <IssueDetailSkeleton />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  if (isError) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent
          responsive
          responsiveWidth={{ desktop: "w-[540px]" }}
          className="mt-4 mr-4 overflow-y-auto rounded-t-[22px] md:h-[97vh] md:rounded-[22px]"
        >
          <div className="flex h-full flex-col">
            <SheetHeaderContent
              number={number}
              title={displayIssue.title}
              onClose={handleClose}
            />
            <div className="flex-1 overflow-y-auto">
              <ErrorState
                message="An error has occurred while loading the issue. Please try again later."
                queryKey={[
                  "open-issue-detail",
                  projectId,
                  parseInt(number || "0"),
                ]}
                className="mt-28"
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        responsive
        responsiveWidth={{ desktop: "w-[540px]" }}
        className="mt-4 mr-4 overflow-y-auto rounded-t-[22px] md:h-[97vh] md:rounded-[22px]"
      >
        <div className="flex h-full flex-col">
          <SheetHeaderContent
            number={number}
            title={displayIssue.title}
            onClose={handleClose}
          />
          <div className="flex-1 overflow-y-auto">
            <div className="my-5 max-w-none">
              {/* Issue Header */}
              <div>
                {/* Issue Meta */}
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href={`https://github.com/${displayIssue.author?.login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={displayIssue.author?.avatar_url}
                        name={displayIssue.author?.login || ""}
                        size="lg"
                      />
                      <div>
                        <div className="text-sm font-medium">
                          {displayIssue.author?.login}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          Opened about {formatTimeAgo(displayIssue.created_at)}{" "}
                          ago
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                <Separator className="my-4" />
              </div>

              {/* Issue Body */}
              <div className="font-geist text-sm leading-relaxed">
                {displayIssue.body ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={issueMarkdownComponents as Components}
                  >
                    {displayIssue.body}
                  </ReactMarkdown>
                ) : (
                  <p className="text-muted-foreground italic">
                    No description provided for this issue.
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="sticky bottom-0 z-50 bg-white">
            <div className="-mx-6">
              <div className="border-muted-black-stroke border-t" />
              <div
                className={cn(
                  "flex items-center gap-4 px-6 pt-4",
                  displayIssue.labels && displayIssue.labels.length > 0
                    ? "justify-between"
                    : "justify-end"
                )}
              >
                {displayIssue.labels && displayIssue.labels.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge key={displayIssue.labels[0]} variant="gray">
                      {displayIssue.labels[0]}
                    </Badge>

                    {displayIssue.labels.length >= 2 && (
                      <span className="text-muted-foreground flex h-5.5 flex-shrink-0 items-center text-xs font-medium whitespace-nowrap">
                        +{displayIssue.labels.length - 1}
                      </span>
                    )}
                  </div>
                )}

                <Button variant="default" asChild>
                  <Link
                    href={displayIssue.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Work on Issue
                    <GoArrowUpRight className="mt-0.5 size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
