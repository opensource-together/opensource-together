import { Metadata } from "next";
import { Suspense } from "react";

import CTAFooter from "@/shared/components/layout/cta-footer";

import HomepageViews from "@/features/projects/views/homepage.view";

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
        <Suspense>
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
