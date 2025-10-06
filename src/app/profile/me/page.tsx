import { Metadata } from "next";
import { Suspense } from "react";

import CTAFooter from "@/shared/components/layout/cta-footer";

import ProfileView from "@/features/profile/views/profile.view";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Mon Profil | OpenSource Together",
    description: "Mon profil sur OpenSource Together",
  };
}

export default function ProfilePage() {
  return (
    <>
      <Suspense fallback={null}>
        <ProfileView />
      </Suspense>
      <CTAFooter imageIllustration="/illustrations/hooded-man.png" />
    </>
  );
}
