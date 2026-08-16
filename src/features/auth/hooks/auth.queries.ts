import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "../services/auth.service";
import { authKeys } from "./auth.keys";

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: ({ signal }) => getCurrentUser({ signal }),
    retry: 0,
  });
}
