import type { Metadata } from "next";
import { Suspense } from "react";
import SkeletonProjectGrid from "@/features/projects/components/skeletons/skeleton-project-grid.component";
import HomepageViews from "@/features/projects/views/homepage.view";
import CTAFooter from "@/shared/components/layout/cta-footer";

export const metadata: Metadata = {
  title: "OpenSource Together - Find and discover open source projects",
  description:
    "Platform that helps developers find the right open-source projects to learn, grow, and contribute",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  return (
    <>
      <main>
        <Suspense
          fallback={
            <>
              <div className="min-h-[260px] w-full md:min-h-[320px] lg:min-h-[400px]" />
              <div className="mx-6 mb-20 max-w-6xl md:mb-36 lg:mx-auto">
                <SkeletonProjectGrid />
              </div>
            </>
          }
        >
          <HomepageViews />
        </Suspense>
      </main>
      <CTAFooter
        imageIllustrationMobile="/illustrations/king-mobile.png"
        imageIllustration="/illustrations/king.png"
      />
    </>
  );
}
