import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FooterMinimal from "@/shared/components/layout/footer-minimal.component";
import { MarkdownRenderer } from "@/shared/components/ui/markdown-renderer";
import { TableOfContents } from "@/shared/components/ui/table-of-contents";
import {
  type Chapter,
  getHandsOnChapters,
  getLearnChapters,
} from "../../../../content/chapters";
import { NextChapterButton } from "./next-chapter-button";

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

export async function generateStaticParams() {
  const learnChapters = getLearnChapters();
  const handsOnChapters = getHandsOnChapters();

  const params = [
    ...learnChapters.map((chapter) => ({ slug: chapter.slug })),
    ...handsOnChapters.map((chapter) => ({ slug: chapter.slug })),
  ];

  return params;
}

// Disable dynamic params - only serve pre-rendered pages
export const dynamicParams = false;

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
    <div className="mx-auto flex w-full gap-8 px-6 pb-8 md:px-10">
      {/* Sidebar: no top padding so TOC aligns to top of column */}
      <aside className="hidden min-h-0 w-64 shrink-0 lg:block">
        <TableOfContents content={content} chapterTitle={pageTitle} />
      </aside>

      {/* Main Content */}
      <main className="flex min-w-0 flex-1 flex-col items-center pt-8">
        <article className="mb-[80px] w-full max-w-[697px]">
          <div className="mb-8">
            <h1
              id={pageTitleId}
              className="mb-4 scroll-mt-20 font-medium text-[calc(1.875rem-6px)] leading-tight tracking-[-0.04em]"
            >
              {pageTitle}
            </h1>
          </div>

          <div className="markdown-content">
            <MarkdownRenderer content={content} />
          </div>

          <div className="mt-12 flex justify-center pt-8">
            <NextChapterButton
              currentChapter={chapter}
              nextChapter={nextChapter}
              prevChapter={prevChapter}
              chaptersForProgress={
                type === "learn" ? getLearnChapters() : getHandsOnChapters()
              }
            />
          </div>
        </article>
        <FooterMinimal className="mt-0 block w-full shrink-0 self-stretch" />
      </main>
    </div>
  );
}
