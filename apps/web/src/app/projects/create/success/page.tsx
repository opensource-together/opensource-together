import { Suspense } from "react";

import StepSuccessView from "@/features/projects/views/stepper-views/step-succes.view";

export default function page() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <StepSuccessView />
    </Suspense>
  );
}
