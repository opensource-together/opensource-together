import type { PaginatedResponse } from "@/shared/types/pagination.type";
import type { Project } from "../../projects/types/project.type";

const DAY = 86_400_000;

export interface RecapWeek {
  id: string;
  start: Date;
  end: Date;
  label: string;
}

export function getWeek(date: Date): RecapWeek {
  const start = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  start.setUTCDate(start.getUTCDate() - ((start.getUTCDay() + 6) % 7));
  const end = new Date(start.getTime() + 7 * DAY);
  const formatter = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  return {
    id: start.toISOString().slice(0, 10),
    start,
    end,
    label: formatter.formatRange(start, new Date(end.getTime() - DAY)),
  };
}

export function shiftWeek(week: RecapWeek, offset: number) {
  return getWeek(new Date(week.start.getTime() + offset * 7 * DAY));
}

export async function collectWeeklyProjects(
  week: RecapWeek,
  loadPage: (page: number) => Promise<PaginatedResponse<Project>>
): Promise<Project[]> {
  const projects = new Map<string, Project>();
  for (let page = 1; ; page++) {
    const response = await loadPage(page);
    let reachedOlderProjects = false;
    for (const project of response.data) {
      const createdAt = new Date(project.createdAt).getTime();
      if (createdAt < week.start.getTime()) reachedOlderProjects = true;
      const id = project.id || project.publicId;
      if (
        id &&
        project.published &&
        createdAt >= week.start.getTime() &&
        createdAt < week.end.getTime()
      ) {
        projects.set(id, project);
      }
    }
    // The API is sorted by createdAt descending; older pages cannot match.
    if (
      reachedOlderProjects ||
      response.data.length === 0 ||
      page >= response.pagination.lastPage
    )
      break;
  }
  return [...projects.values()];
}
