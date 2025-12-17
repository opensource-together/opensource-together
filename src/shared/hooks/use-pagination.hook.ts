import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import type { PageInfo, PaginationConfig } from "../types/pagination.type";

interface UsePaginationProps extends PaginationConfig {
  pagination: {
    total: number;
    lastPage: number;
    currentPage: number;
    size: number;
  };
}

/**
 * Custom hook for pagination logic
 * Provides page generation, navigation, and URL synchronization
 */
export function usePagination({ pagination }: UsePaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Generate page numbers to display (exactly 3 pages with ellipses)
  const pages = useMemo((): PageInfo[] => {
    const { currentPage, lastPage } = pagination;
    const pages: PageInfo[] = [];

    // Always show exactly 3 pages
    const showEllipsis = lastPage > 3;

    if (!showEllipsis) {
      // Show all pages if 3 or less
      for (let i = 1; i <= lastPage; i++) {
        pages.push({
          number: i,
          isActive: i === currentPage,
          isEllipsis: false,
        });
      }
    } else {
      // Show 3 pages with smart positioning
      if (currentPage <= 2) {
        // Show 1, 2, 3 when on first pages
        for (let i = 1; i <= 3; i++) {
          pages.push({
            number: i,
            isActive: i === currentPage,
            isEllipsis: false,
          });
        }
      } else if (currentPage >= lastPage - 1) {
        // Show last 3 pages when on last pages
        for (let i = lastPage - 2; i <= lastPage; i++) {
          pages.push({
            number: i,
            isActive: i === currentPage,
            isEllipsis: false,
          });
        }
      } else {
        // Show current page and neighbors when in middle
        pages.push({
          number: currentPage - 1,
          isActive: false,
          isEllipsis: false,
        });
        pages.push({
          number: currentPage,
          isActive: true,
          isEllipsis: false,
        });
        pages.push({
          number: currentPage + 1,
          isActive: false,
          isEllipsis: false,
        });
      }
    }

    return pages;
  }, [pagination]);

  // Navigation handlers
  const navigateToPage = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    router.push(`?${newParams.toString()}`);
  };

  const goToNextPage = () => {
    if (pagination.currentPage < pagination.lastPage) {
      navigateToPage(pagination.currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (pagination.currentPage > 1) {
      navigateToPage(pagination.currentPage - 1);
    }
  };

  const goToFirstPage = () => {
    navigateToPage(1);
  };

  const goToLastPage = () => {
    navigateToPage(pagination.lastPage);
  };

  // Computed values
  const canGoPrevious = pagination.currentPage > 1;
  const canGoNext = pagination.currentPage < pagination.lastPage;
  const hasMultiplePages = pagination.lastPage > 1;

  return {
    pages,
    canGoPrevious,
    canGoNext,
    hasMultiplePages,
    navigateToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
  };
}
