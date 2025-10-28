import { useState } from "react";

import { useCategories } from "./use-category.hook";

/**
 * Hook for lazy loading categories when the popover opens
 * @returns {Object} - An object containing category options, loading state, and onOpenChange handler
 */
export function useLazyCategory() {
  const [isOpen, setIsOpen] = useState(false);
  const { categoryOptions, isLoading } = useCategories({ enabled: isOpen });

  return {
    categoryOptions,
    isLoading,
    onOpenChange: setIsOpen,
  };
}
