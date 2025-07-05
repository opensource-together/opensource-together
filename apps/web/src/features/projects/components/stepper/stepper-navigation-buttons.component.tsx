"use client";

import { Button } from "@/shared/components/ui/button";
import Icon from "@/shared/components/ui/icon";

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
  nextLabel = "Suivant",
  previousLabel = "Retour",
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
          variant="outline"
          onClick={onPrevious}
          disabled={isPreviousDisabled || isLoading}
        >
          <Icon name="chevron-left" size="xs" />
          {previousLabel}
        </Button>
      )}

      {showNext && (
        <Button
          type={nextType}
          onClick={nextType === "button" ? onNext : undefined}
          disabled={isNextDisabled || isLoading}
        >
          {isLoading ? "En cours..." : nextLabel}
          <Icon name="chevron-right" size="xs" variant="white" />
        </Button>
      )}
    </div>
  );
}

export default FormNavigationButtons;
