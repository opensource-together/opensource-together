import type { Metadata } from "next";
import { Suspense } from "react";
import ProfileView from "@/features/profile/views/profile.view";
import CTAFooter from "@/shared/components/layout/cta-footer";

export const metadata: Metadata = {
  title: "My Profile",
  description: "My profile on OpenSource Together",
  robots: {
    index: false,
    follow: false,
  },
};

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
