export interface ProjectFilters {
  techStacks: string[];
  categories: string[];
  orderBy: "createdAt" | "title" | "trending";
  orderDirection: "asc" | "desc";
}
