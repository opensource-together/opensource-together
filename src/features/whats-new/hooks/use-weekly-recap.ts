"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useCurrentUserQuery } from "@/features/auth/hooks/auth.queries";
import { getProjects } from "@/features/projects/services/project.service";
import { getWeek, type RecapWeek } from "../lib/weekly-recap";
import { weeklyRecapQueryOptions } from "../lib/weekly-recap-query";

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
  const currentWeek = useCurrentWeek();
  const currentUser = useCurrentUserQuery();
  const options = weeklyRecapQueryOptions(
    week,
    currentWeek,
    !!currentUser.data,
    (page, signal) =>
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
  const query = useQuery({ ...options, enabled: enabled && options.enabled });
  // A disabled query can still contain cached data; don't expose a locked edition.
  return { ...query, data: options.enabled ? query.data : undefined };
}
