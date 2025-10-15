import { Metadata } from "next";
import { Suspense } from "react";
import { LuLoaderCircle } from "react-icons/lu";

import StepSuccessView from "@/features/projects/views/stepper-views/common/step-succes.view";

export const metadata: Metadata = {
  title: "Project created successfully | OpenSource Together",
  description: "Project created successfully on OpenSource Together",
};

export default function page() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <LuLoaderCircle className="size-12 animate-spin" />
        </div>
      }
    >
      <StepSuccessView />
    </Suspense>
  );
}
