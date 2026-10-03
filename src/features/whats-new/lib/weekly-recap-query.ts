import type { PaginatedResponse } from "@/shared/types/pagination.type";
import type { Project } from "../../projects/types/project.type";
import { collectWeeklyProjects, type RecapWeek } from "./weekly-recap";

export function weeklyRecapQueryOptions(
  week: RecapWeek | null,
  currentWeek: RecapWeek | null,
  isAuthenticated: boolean,
  loadPage: (
    page: number,
    signal: AbortSignal
  ) => Promise<PaginatedResponse<Project>>
) {
  const allowed = Boolean(
    week &&
      currentWeek &&
      (week.id === currentWeek.id ||
        (isAuthenticated && week.start.getTime() < currentWeek.start.getTime()))
  );

  return {
    queryKey: [
      "whats-new",
      isAuthenticated ? "authenticated" : "public",
      week?.id,
    ],
    enabled: allowed,
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      if (!allowed || !week)
        throw new Error("Sign in to browse previous editions.");
      return collectWeeklyProjects(week, (page) => loadPage(page, signal));
    },
    staleTime: 5 * 60_000,
  };
}
