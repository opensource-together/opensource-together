import { cn } from "@/shared/lib/utils";

import type { PaginationMeta } from "../../types/pagination.type";

interface PaginationInfoProps {
  pagination: PaginationMeta;
  className?: string;
}

/**
 * Component to display pagination information
 * Shows current range and total items
 */
export function PaginationInfo({ pagination, className }: PaginationInfoProps) {
  const { currentPage, size, total } = pagination;

  const startItem = (currentPage - 1) * size + 1;
  const endItem = Math.min(currentPage * size, total);

  return (
    <div
      className={cn("hidden text-muted-foreground text-sm md:block", className)}
    >
      Showing {startItem} to {endItem} of {total} results
    </div>
  );
}
