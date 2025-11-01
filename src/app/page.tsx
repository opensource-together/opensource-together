import { Suspense } from "react";

import CTAFooter from "@/shared/components/layout/cta-footer";

import HomepageViews from "@/features/projects/views/homepage.view";

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
