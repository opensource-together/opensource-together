import CTAFooter from "@/shared/components/layout/cta-footer";

import ProfileView from "@/features/profile/views/profile.view";

export default function ProfilePage() {
  return (
    <>
      <ProfileView />
      <CTAFooter imageIllustration="/illustrations/hooded-man.png" />
    </>
  );
}
