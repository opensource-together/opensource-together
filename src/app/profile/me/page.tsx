import { Metadata } from "next";
import { Suspense } from "react";

import CTAFooter from "@/shared/components/layout/cta-footer";

import ProfileView from "@/features/profile/views/profile.view";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "My Profile | OpenSource Together",
    description: "My profile on OpenSource Together",
  };
}

export default function ProfilePage() {
  return (
    <>
      <Suspense fallback={null}>
        <ProfileView />
      </Suspense>
      <CTAFooter
        imageIllustrationMobile="/illustrations/magician-mobile.png"
        imageIllustration="/illustrations/magician.png"
      />
    </>
  );
}
