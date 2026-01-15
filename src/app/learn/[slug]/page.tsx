import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HiChevronLeft } from "react-icons/hi2";
import { MarkdownRenderer } from "@/shared/components/ui/markdown-renderer";
import { TableOfContents } from "@/shared/components/ui/table-of-contents";
import {
  type Chapter,
  getHandsOnChapters,
  getLearnChapters,
} from "../../../../content/chapters";
import { getChapterContent } from "../../../../content/content-loader";
import { NextChapterButton } from "./next-chapter-button";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function getChapterContentWithMetadata(
  slug: string,
  type: "learn" | "hands-on"
): {
  content: string;
  frontmatter: { title?: string; description?: string };
  chapter: Chapter | undefined;
} | null {
  const contentData = getChapterContent(slug, type);
  if (!contentData) {
    return null;
  }

  const chapters = type === "learn" ? getLearnChapters() : getHandsOnChapters();
  const chapter = chapters.find((c: Chapter) => c.slug === slug);

  return {
    content: contentData.content,
    frontmatter: contentData.frontmatter,
    chapter,
  };
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

  return [
    ...learnChapters.map((chapter) => ({ slug: chapter.slug })),
    ...handsOnChapters.map((chapter) => ({ slug: chapter.slug })),
  ];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  let result = getChapterContentWithMetadata(slug, "learn");

  if (!result) {
    result = getChapterContentWithMetadata(slug, "hands-on");
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

  let result = getChapterContentWithMetadata(slug, "learn");
  let type: "learn" | "hands-on" = "learn";

  if (!result) {
    result = getChapterContentWithMetadata(slug, "hands-on");
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
    <div className="mx-auto flex w-full gap-8 px-6 pt-8 pb-28 md:px-10">
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

          <div className="mt-12 flex justify-center border-border border-t pt-8">
            <NextChapterButton
              currentChapter={chapter}
              nextChapter={nextChapter}
            />
          </div>

          {/* Navigation */}
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
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
                  <span className="truncate font-medium text-sm">
                    {prevChapter.title}
                  </span>
                </div>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </article>
      </main>
    </div>
  );
}
