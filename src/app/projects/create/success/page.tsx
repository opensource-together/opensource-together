import { Suspense } from "react";
import { LuLoaderCircle } from "react-icons/lu";

import StepSuccessView from "@/features/projects/views/stepper-views/step-succes.view";

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
