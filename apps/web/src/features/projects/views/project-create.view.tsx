"use client";

import StepperForm from "../components/stepper/stepper-form.component";

/**
 * Renders the project creation view with a stepper form inside a centered container.
 *
 * Displays the `StepperForm` component within a styled div for layout consistency.
 */
export default function ProjectCreateView() {
  return (
    <>
      <div className="mx-auto mt-8 max-w-2xl">
        <StepperForm />
      </div>
    </>
  );
}
