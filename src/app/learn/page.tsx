import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HiChevronRight } from "react-icons/hi2";
import CTAFooter from "@/shared/components/layout/cta-footer";
import { Button } from "@/shared/components/ui/button";
import HeroBadge from "@/shared/components/ui/hero-badge";
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
  return (
    <main className="mx-auto w-full">
      <div className="relative mx-auto w-full">
        <Image
          src="/illustrations/traveler.png"
          alt="Traveler illustration"
          width={1441}
          height={400}
          priority
          fetchPriority="high"
          quality={85}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 95vw, (max-width: 1024px) 100vw, 1441px"
          className="absolute bottom-6 left-1/2 z-[-1] hidden h-auto w-[100%] -translate-x-1/2 object-contain md:block lg:bottom-3 lg:w-[105%]"
        />

        <div className="relative z-10 mx-auto mt-12 flex w-full max-w-[1441px] flex-col items-center justify-center">
          <HeroBadge className="mb-3" />
          <div className="mx-6">
            <h1
              className="mt-3 text-center text-3xl leading-none md:text-5xl"
              style={{ fontFamily: "Aspekta", fontWeight: 500 }}
            >
              Learn and Practice <br />
              Open Source
            </h1>
            <p className="mt-5 max-w-[450px] px-2 text-center text-neutral-950 text-sm">
              Learn about open source, prepare your project, and release it
              publicly with confidence.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href={`/learn/${getLearnChapters()[0]?.slug || "getting-started"}`}
              >
                <Button variant="default" size="lg">
                  Start Learning <HiChevronRight className="size-4" />
                </Button>
              </Link>
              <Link
                href={`/learn/${getHandsOnChapters()[0]?.slug || "choose-right-license"}`}
              >
                <Button variant="secondary" size="lg">
                  Start Hands-On
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Learn and Practice Cards */}
      <div className="mx-auto my-20 w-full max-w-5xl px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Learn Card */}
          <div className="relative overflow-hidden rounded-[20px] border border-muted-black-stroke p-6">
            <div className="flex flex-col gap-4">
              <h2 className="font-medium text-xl">Learn About Open Source</h2>
              <p className="text-muted-foreground text-sm">
                Understand the fundamentals of open source, best practices, and
                how to contribute effectively to projects.
              </p>
              <Image
                src="/illustrations/lost-man-404.png"
                alt="Learn"
                width={500}
                height={500}
                className="h-auto w-full"
              />
              <Link
                href={`/learn/${getLearnChapters()[0]?.slug || "getting-started"}`}
              >
                <Button className="w-full">
                  Start Learning
                  <HiChevronRight />
                </Button>
              </Link>
              <Button variant="ghost">Browse Chapters</Button>
            </div>
          </div>

          {/* Practice Card */}
          <div className="relative overflow-hidden rounded-[20px] border border-muted-black-stroke p-6">
            <div className="flex flex-col gap-4">
              <h2 className="font-medium text-xl">Get Hands-On Experience</h2>
              <p className="text-muted-foreground text-sm">
                Get hands-on experience by working on real open source projects,
                contributing code, and building your portfolio.
              </p>
              <Image
                src="/illustrations/lost-man-404.png"
                alt="Practice"
                width={500}
                height={500}
                className="h-auto w-full"
              />
              <Link
                href={`/learn/${getHandsOnChapters()[0]?.slug || "choose-right-license"}`}
              >
                <Button variant="default" className="w-full">
                  Get Started
                  <HiChevronRight />
                </Button>
              </Link>
              <Button variant="ghost">Browse Chapters</Button>
            </div>
          </div>
        </div>
      </div>

      <CTAFooter
        imageIllustration="/illustrations/winged-angel.png"
        imageIllustrationMobile="/illustrations/winged-angel-mobile.png"
      />
    </main>
  );
}
