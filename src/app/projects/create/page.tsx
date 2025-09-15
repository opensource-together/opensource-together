import { Metadata } from "next";

import StepZeroView from "@/features/projects/views/stepper-views/step-zero.view";

export const metadata: Metadata = {
  title: "Choisir une méthode de création | OpenSource Together",
  description:
    "Choisissez une méthode de création pour votre projet OpenSource Together",
};

export default function ProjectCreateMethodPage() {
  return <StepZeroView />;
}
