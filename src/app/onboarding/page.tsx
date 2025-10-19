import { Metadata } from "next";

import OnboardingView from "@/features/auth/views/onboarding.view";

export const metadata: Metadata = {
  title: "Onboarding | OpenSource Together",
  description: "Complete your profile to get personalized project suggestions.",
};

export default function OnboardingPage() {
  return <OnboardingView />;
}
