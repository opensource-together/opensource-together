import CTAFooter from "@/shared/components/layout/cta-footer";

import { mockPublicProfile } from "@/features/profile/mocks/public-profile.mock";
import { PublicProfileView } from "@/features/profile/views/public-profile.view";

export default function TestProfilePage() {
  return (
    <>
      <PublicProfileView userId={mockPublicProfile.id} />
      <CTAFooter imageIllustration="/illustrations/hooded-man.png" />
    </>
  );
}
