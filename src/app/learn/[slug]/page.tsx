import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { MarkdownRenderer } from "@/shared/components/ui/markdown-renderer";
import { TableOfContents } from "@/shared/components/ui/table-of-contents";
import { handsOnChapters } from "../../../../content/hands-on/hands-on-chapters";
import {
  type Chapter,
  learnChapters,
} from "../../../../content/learn/learn-chapters";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getChapterContent(
  slug: string,
  type: "learn" | "hands-on"
): Promise<{ content: string; chapter: Chapter | undefined } | null> {
  try {
    const contentPath = path.join(
      process.cwd(),
      "content",
      type === "learn" ? "learn" : "hands-on",
      `${slug}.mdx`
    );
    const content = fs.readFileSync(contentPath, "utf-8");

    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    const markdownContent = frontmatterMatch ? frontmatterMatch[2] : content;

    const chapters = type === "learn" ? learnChapters : handsOnChapters;
    const chapter = chapters.find((c: Chapter) => c.slug === slug);

    return { content: markdownContent, chapter };
  } catch {
    return null;
  }
}

function getNextChapter(
  currentSlug: string,
  type: "learn" | "hands-on"
): Chapter | null {
  const chapters = type === "learn" ? learnChapters : handsOnChapters;
  const currentIndex = chapters.findIndex(
    (c: Chapter) => c.slug === currentSlug
  );
  if (currentIndex >= 0 && currentIndex < chapters.length - 1) {
    return chapters[currentIndex + 1];
  }
  return null;
}

function getPrevChapter(
  currentSlug: string,
  type: "learn" | "hands-on"
): Chapter | null {
  const chapters = type === "learn" ? learnChapters : handsOnChapters;
  const currentIndex = chapters.findIndex(
    (c: Chapter) => c.slug === currentSlug
  );
  if (currentIndex > 0) {
    return chapters[currentIndex - 1];
  }
  return null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  let result = await getChapterContent(slug, "learn");

  if (!result) {
    result = await getChapterContent(slug, "hands-on");
  }

  if (!result || !result.chapter) {
    return {
      title: "Chapter Not Found",
    };
  }

  return {
    title: `${result.chapter.title} | Learn`,
    description:
      result.chapter.description || `Learn about ${result.chapter.title}`,
  };
}

export default async function ChapterPage({ params }: PageProps) {
  const { slug } = await params;

  // Try learn first, then hands-on
  let result = await getChapterContent(slug, "learn");
  let type: "learn" | "hands-on" = "learn";

  if (!result) {
    result = await getChapterContent(slug, "hands-on");
    type = "hands-on";
  }

  if (!result || !result.chapter) {
    notFound();
  }

  const { content, chapter } = result;
  const nextChapter = getNextChapter(slug, type);
  const prevChapter = getPrevChapter(slug, type);

  return (
    <div className="mx-auto flex w-full gap-8 px-6 py-8 md:px-10">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <TableOfContents content={content} chapterTitle={chapter.title} />
      </aside>

      {/* Main Content */}
      <main className="mx-auto min-w-0 max-w-[677px]">
        <article>
          {/* Chapter Header */}
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground text-sm">
              {chapter.difficulty && (
                <>
                  <span>{chapter.difficulty}</span>
                  {chapter.readingTime && (
                    <>
                      <span>•</span>
                      <span>{chapter.readingTime} min</span>
                    </>
                  )}
                </>
              )}
            </div>
            <h1
              id={chapter.title
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-")}
              className="mb-4 scroll-mt-20 font-medium text-3xl"
            >
              {chapter.title}
            </h1>
          </div>

          {/* Content */}
          <div className="markdown-content">
            <MarkdownRenderer content={content} />
          </div>

          {/* Navigation */}
          <div className="mt-12 flex items-center justify-between border-border border-t pt-8">
            {prevChapter ? (
              <Link
                href={`/learn/${prevChapter.slug}`}
                className="flex items-center gap-2 text-foreground transition-colors hover:text-ost-blue-three"
              >
                <HiChevronLeft className="h-4 w-4" />
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">
                    Previous
                  </span>
                  <span className="font-medium">{prevChapter.title}</span>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextChapter && (
              <Link
                href={`/learn/${nextChapter.slug}`}
                className="ml-auto flex items-center gap-2 text-foreground transition-colors hover:text-ost-blue-three"
              >
                <div className="flex flex-col text-right">
                  <span className="text-muted-foreground text-xs">Next</span>
                  <span className="font-medium">{nextChapter.title}</span>
                </div>
                <HiChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </article>
      </main>
    </div>
  );
}
