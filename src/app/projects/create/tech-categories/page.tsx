import { Metadata } from "next";

import StepTechCategoriesView from "@/features/projects/views/stepper-views/common/step-tech-categories.view";

export const metadata: Metadata = {
  title: "Add technologies & categories",
  description:
    "Add technologies & categories to your project on OpenSource Together",
};

export default function page() {
  return <StepTechCategoriesView />;
}
