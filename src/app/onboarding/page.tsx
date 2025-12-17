import type { Metadata } from "next";

import OnboardingView from "@/features/auth/views/onboarding.view";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Complete your profile to get personalized project suggestions.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OnboardingPage() {
  return <OnboardingView />;
}
