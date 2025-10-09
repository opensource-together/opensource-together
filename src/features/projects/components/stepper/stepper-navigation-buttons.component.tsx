"use client";

import { Button } from "@/shared/components/ui/button";

interface FormNavigationButtonsProps {
  onPrevious?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  previousLabel?: string;
  isNextDisabled?: boolean;
  isPreviousDisabled?: boolean;
  isLoading?: boolean;
  showPrevious?: boolean;
  showNext?: boolean;
  nextType?: "button" | "submit";
}

export function FormNavigationButtons({
  onPrevious,
  onNext,
  nextLabel = "Next",
  previousLabel = "Back",
  isNextDisabled = false,
  isPreviousDisabled = false,
  isLoading = false,
  showPrevious = true,
  showNext = true,
  nextType = "submit",
}: FormNavigationButtonsProps) {
  return (
    <div className="mt-6 flex justify-center space-x-4">
      {showPrevious && (
        <Button
          type="button"
          variant="ghost"
          onClick={onPrevious}
          disabled={isPreviousDisabled || isLoading}
        >
          {previousLabel}
        </Button>
      )}

      {showNext && (
        <Button
          type={nextType}
          onClick={nextType === "button" ? onNext : undefined}
          disabled={isNextDisabled || isLoading}
        >
          {isLoading ? "Loading..." : nextLabel}
        </Button>
      )}
    </div>
  );
}

export default FormNavigationButtons;
