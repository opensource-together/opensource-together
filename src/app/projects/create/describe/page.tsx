import { Metadata } from "next";

import StepProjectDetailsView from "@/features/projects/views/stepper-views/common/step-project-describe.view";

export const metadata: Metadata = {
  title: "Describe your project | OpenSource Together",
  description: "Describe your project on OpenSource Together",
};

export default function page() {
  return <StepProjectDetailsView />;
}
