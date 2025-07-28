import { useQuery } from "@tanstack/react-query";

import { mockApplicationsReceived } from "../mocks/my-projects.mock";

interface UseApplicationsReceivedOptions {
  projectId?: string;
  status?: "PENDING" | "ACCEPTED" | "REJECTED" | "ALL";
}

export function useApplicationsReceived(
  options?: UseApplicationsReceivedOptions
) {
  return useQuery({
    queryKey: ["applications-received", options],
    queryFn: () => Promise.resolve(mockApplicationsReceived),
  });
}
