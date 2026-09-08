"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getProjects } from "@/features/projects/services/project.service";
import {
  collectWeeklyProjects,
  getWeek,
  type RecapWeek,
} from "../lib/weekly-recap";

export function useCurrentWeek() {
  const [week, setWeek] = useState<RecapWeek | null>(null);
  useEffect(() => {
    const update = () => {
      const next = getWeek(new Date());
      setWeek((previous) => (previous?.id === next.id ? previous : next));
    };
    update();
    const interval = window.setInterval(update, 60_000);
    return () => window.clearInterval(interval);
  }, []);
  return week;
}

export function useWeeklyRecap(week: RecapWeek | null, enabled = true) {
  return useQuery({
    queryKey: ["whats-new", week?.id],
    enabled: enabled && week !== null,
    queryFn: ({ signal }) => {
      if (!week) throw new Error("A recap week is required");
      return collectWeeklyProjects(week, (page) =>
        getProjects(
          {
            published: true,
            orderBy: "createdAt",
            orderDirection: "desc",
            page,
            per_page: 100,
          },
          { signal }
        )
      );
    },
    staleTime: 5 * 60_000,
  });
}
