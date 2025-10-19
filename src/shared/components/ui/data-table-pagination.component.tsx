import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { cn } from "@/shared/lib/utils";

import { usePagination } from "../../hooks/use-pagination.hook";
import { PaginationConfig, PaginationMeta } from "../../types/pagination.type";

interface DataTablePaginationProps extends PaginationConfig {
  pagination: PaginationMeta;
}

/**
 * Reusable pagination component for data tables
 * Follows design system patterns and provides consistent UX
 */
export function DataTablePagination({
  pagination,
  maxVisiblePages = 5,
  showFirstLast = true,
  showPreviousNext = true,
  className,
}: DataTablePaginationProps) {
  const {
    pages,
    canGoPrevious,
    canGoNext,
    hasMultiplePages,
    navigateToPage,
    goToNextPage,
    goToPreviousPage,
  } = usePagination({
    pagination,
    maxVisiblePages,
    showFirstLast,
    showPreviousNext,
  });

  if (!hasMultiplePages) {
    return null;
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Pagination>
        <PaginationContent>
          {/* Previous Button */}
          {showPreviousNext && (
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (canGoPrevious) goToPreviousPage();
                }}
                isActive={false}
                variant="ghost"
                className={cn(
                  "rounded-full",
                  !canGoPrevious && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
          )}

          {/* Page Numbers */}
          {pages.map((page, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToPage(page.number);
                }}
                isActive={page.isActive}
                variant={page.isActive ? "outline" : "ghost"}
                className={cn("rounded-full", !page.isActive && "border-none")}
              >
                {page.number}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Next Button */}
          {showPreviousNext && (
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (canGoNext) goToNextPage();
                }}
                isActive={false}
                variant="ghost"
                className={cn(
                  "rounded-full",
                  !canGoNext && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
