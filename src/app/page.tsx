import { Metadata } from "next";
import { Suspense } from "react";

import CTAFooter from "@/shared/components/layout/cta-footer";

import HomepageViews from "@/features/projects/views/homepage.view";

export const metadata: Metadata = {
  title: "Discover open source projects",
  description:
    "Platform that helps developers find the right open-source projects to learn, grow, and contribute",
};

export default async function HomePage() {
  return (
    <>
      <Suspense>
        <HomepageViews />
      </Suspense>
      <CTAFooter
        imageIllustrationMobile="/illustrations/king-mobile.png"
        imageIllustration="/illustrations/king.png"
      />
    </>
  );
}
