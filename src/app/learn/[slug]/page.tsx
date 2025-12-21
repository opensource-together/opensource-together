import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { MarkdownRenderer } from "@/shared/components/ui/markdown-renderer";
import { TableOfContents } from "@/shared/components/ui/table-of-contents";
import {
  type Chapter,
  getHandsOnChapters,
  getLearnChapters,
} from "../../../../content/chapters";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface Frontmatter {
  title?: string;
  description?: string;
}

async function getChapterContent(
  slug: string,
  type: "learn" | "hands-on"
): Promise<{
  content: string;
  frontmatter: Frontmatter;
  chapter: Chapter | undefined;
} | null> {
  try {
    const contentPath = path.join(
      process.cwd(),
      "content",
      type === "learn" ? "learn" : "hands-on",
      `${slug}.mdx`
    );
    const content = fs.readFileSync(contentPath, "utf-8");

    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    const markdownContent = frontmatterMatch ? frontmatterMatch[2] : content;

    const frontmatter: Frontmatter = {};
    if (frontmatterMatch) {
      const frontmatterText = frontmatterMatch[1];
      const titleMatch = frontmatterText.match(/^title:\s*["'](.+?)["']/m);
      const descriptionMatch = frontmatterText.match(
        /^description:\s*["'](.+?)["']/m
      );

      if (titleMatch) {
        frontmatter.title = titleMatch[1];
      }
      if (descriptionMatch) {
        frontmatter.description = descriptionMatch[1];
      }
    }

    const chapters =
      type === "learn" ? getLearnChapters() : getHandsOnChapters();
    const chapter = chapters.find((c: Chapter) => c.slug === slug);

    return { content: markdownContent, frontmatter, chapter };
  } catch {
    return null;
  }
}

function getNextChapter(
  currentSlug: string,
  type: "learn" | "hands-on"
): Chapter | null {
  const chapters = type === "learn" ? getLearnChapters() : getHandsOnChapters();
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
  const chapters = type === "learn" ? getLearnChapters() : getHandsOnChapters();
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

  const pageTitle = result.frontmatter.title ?? result.chapter.title;

  return {
    title: pageTitle,
    description:
      result.frontmatter.description ||
      result.chapter.description ||
      `Learn about ${pageTitle}`,
  };
}

export default async function ChapterPage({ params }: PageProps) {
  const { slug } = await params;

  let result = await getChapterContent(slug, "learn");
  let type: "learn" | "hands-on" = "learn";

  if (!result) {
    result = await getChapterContent(slug, "hands-on");
    type = "hands-on";
  }

  if (!result || !result.chapter) {
    notFound();
  }

  const { content, frontmatter, chapter } = result;
  const nextChapter = getNextChapter(slug, type);
  const prevChapter = getPrevChapter(slug, type);

  const pageTitle = frontmatter.title ?? chapter.title;
  const pageTitleId = pageTitle;

  return (
    <div className="mx-auto flex w-full gap-8 px-6 py-8 md:px-10">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <TableOfContents content={content} chapterTitle={pageTitle} />
      </aside>

      {/* Main Content */}
      <main className="mx-auto min-w-0 max-w-[677px]">
        <article>
          <div className="mb-8">
            <h1
              id={pageTitleId}
              className="mb-4 scroll-mt-20 font-medium text-3xl"
            >
              {pageTitle}
            </h1>
          </div>

          <div className="markdown-content">
            <MarkdownRenderer content={content} />
          </div>

          {/* Navigation */}
          <div className="mt-12 grid grid-cols-1 gap-4 border-border border-t pt-8 md:grid-cols-2">
            {prevChapter ? (
              <Link
                href={`/learn/${prevChapter.slug}`}
                className="group flex items-center gap-4 p-4 transition-all hover:text-ost-blue-three"
              >
                <HiChevronLeft className="h-4 w-4" />
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">
                    Previous
                  </span>
                  <span className="truncate font-medium">
                    {prevChapter.title}
                  </span>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextChapter && (
              <Link
                href={`/learn/${nextChapter.slug}`}
                className="group flex items-center gap-4 p-4 transition-all hover:text-ost-blue-three"
              >
                <div className="flex flex-col text-right">
                  <span className="text-muted-foreground text-xs">Next</span>
                  <span className="truncate font-medium">
                    {nextChapter.title}
                  </span>
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
