import type { Metadata } from "next";
import CTAFooter from "@/shared/components/layout/cta-footer";
import {
  getHandsOnChapters,
  getLearnChapters,
} from "../../../../content/chapters";
import { ChaptersList } from "./chapters-list";

export const metadata: Metadata = {
  title: "Browse Chapters",
  description: "Browse all available chapters and track your progress.",
  alternates: { canonical: "/learn/chapters" },
};

export default function ChaptersPage() {
  const learnChapters = getLearnChapters();
  const handsOnChapters = getHandsOnChapters();

  return (
    <>
      <main className="mx-auto w-full max-w-5xl px-6 py-16 md:px-10">
        <div className="mb-8">
          <h1 className="font-medium text-2xl">All Chapters</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            Explore all available chapters and track your learning progress.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          <section>
            <h2 className="mb-6 font-medium text-lg">Learn</h2>
            <ChaptersList chapters={learnChapters} />
          </section>

          <section>
            <h2 className="mb-6 font-medium text-lg">Hands-On</h2>
            <ChaptersList chapters={handsOnChapters} />
          </section>
        </div>
      </main>
      <CTAFooter
        imageIllustration="/illustrations/winged-angel.png"
        imageIllustrationMobile="/illustrations/winged-angel-mobile.png"
      />
    </>
  );
}
