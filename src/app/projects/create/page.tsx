import { Metadata } from "next";

import StepIntroductionView from "@/features/projects/views/stepper-views/common/step-introduction.view";

export const metadata: Metadata = {
  title: "Choose a creation method",
  description: "Choose a creation method for your project OpenSource Together",
};

export default function ProjectCreateMethodPage() {
  return <StepIntroductionView />;
}
