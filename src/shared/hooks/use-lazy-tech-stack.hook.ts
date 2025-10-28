import { useState } from "react";

import { useTechStack } from "./use-tech-stack.hook";

/**
 * Hook for lazy loading tech stacks when the popover opens
 * @returns {Object} - An object containing tech stack options, loading state, and onOpenChange handler
 */
export function useLazyTechStack() {
  const [isOpen, setIsOpen] = useState(false);
  const { techStackOptions, isLoading } = useTechStack({ enabled: isOpen });

  return {
    techStackOptions,
    isLoading,
    onOpenChange: setIsOpen,
  };
}
