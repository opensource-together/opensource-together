import type { Metadata } from "next";
import Image from "next/image";
import { LearnHeroIntro } from "@/features/learn/components/learn-hero-intro.component";
import { ChapterProgressCard } from "@/shared/components/ui/chapter-progress-card";
import {
  getHandsOnChapters,
  getLearnChapters,
} from "../../../content/chapters";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Understand the fundamentals, prepare your project, and release it publicly with confidence.",
  alternates: { canonical: "/learn" },
};

export default function LearnPage() {
  const firstLearnSlug = getLearnChapters()[0]?.slug ?? "getting-started";
  const firstHandsOnSlug =
    getHandsOnChapters()[0]?.slug ?? "finding-first-oss-project";

  return (
    <main className="mx-auto w-full">
      <div className="relative mx-auto w-full">
        {/* Desktop image */}
        <Image
          src="/illustrations/lord.png"
          alt="Lord illustration"
          width={1441}
          height={400}
          className="absolute -bottom-14 left-1/2 z-[-1] hidden -translate-x-1/2 object-contain md:block"
        />
        {/* Mobile image */}
        <Image
          src="/illustrations/lord-mobile.png"
          alt="Lord illustration"
          width={402}
          height={361}
          quality={100}
          className="absolute -bottom-0 left-1/2 z-[-1] h-auto w-full -translate-x-1/2 object-contain md:hidden"
        />
        <div className="relative z-10 mx-auto mt-12 flex w-full max-w-[1441px] flex-col items-center justify-center">
          <LearnHeroIntro
            startLearningHref={`/learn/${firstLearnSlug}`}
            startHandsOnHref={`/learn/${firstHandsOnSlug}`}
          />
        </div>
      </div>

      {/* Learn and Practice Cards */}
      <div className="mx-auto my-20 w-full max-w-5xl px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Learn Card */}
          <ChapterProgressCard
            title="Learn About Open-Source"
            description="Understand the fundamentals of open source, best practices, and how to contribute effectively to projects."
            chapters={getLearnChapters()}
            firstChapterSlug={firstLearnSlug}
          />

          {/* Practice Card */}
          <ChapterProgressCard
            title="Get Hands-On Experience"
            description="Get hands-on experience by working on real open source projects, contributing code, and building your portfolio."
            chapters={getHandsOnChapters()}
            firstChapterSlug={firstHandsOnSlug}
          />
        </div>
      </div>
    </main>
  );
}
