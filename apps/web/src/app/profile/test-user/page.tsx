import CTAFooter from "@/shared/components/layout/cta-footer";

import { mockPublicProfile } from "@/features/profile/mocks/public-profile.mock";
import { PublicProfileView } from "@/features/profile/views/public-profile.view";

export default function TestProfilePage() {
  return (
    <>
      <PublicProfileView profile={mockPublicProfile} />
      <CTAFooter imageIllustration="/illustrations/hooded-man.png" />
    </>
  );
}
