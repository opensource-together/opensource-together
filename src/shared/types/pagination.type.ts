/**
 * Pagination metadata from API responses
 */
export interface PaginationMeta {
  total: number;
  lastPage: number;
  currentPage: number;
  size: number;
}

/**
 * Generic paginated API response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

/**
 * Query parameters for pagination
 */
export interface PaginationParams {
  page?: number;
  per_page?: number;
}

/**
 * Configuration for pagination component
 */
export interface PaginationConfig {
  maxVisiblePages?: number;
  showFirstLast?: boolean;
  showPreviousNext?: boolean;
  className?: string;
}

/**
 * Page number information for rendering
 */
export interface PageInfo {
  number: number;
  isActive: boolean;
  isEllipsis: boolean;
}
