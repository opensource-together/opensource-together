import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useCurrentUserQuery } from "./auth.queries";

export function useOnboardingRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const currentUserQuery = useCurrentUserQuery();

  useEffect(() => {
    const currentUser = currentUserQuery.data;
    if (currentUserQuery.isLoading || !currentUser) return;

    const isOnboardingCompleted =
      !!currentUser.jobTitle ||
      (currentUser.userTechStacks?.length ?? 0) > 0 ||
      (currentUser.userCategories?.length ?? 0) > 0;

    const isOnboarding = pathname?.startsWith("/onboarding");
    const isAuth = pathname?.startsWith("/auth");

    if (!isOnboardingCompleted && !isOnboarding && !isAuth) {
      router.push("/onboarding");
    }
  }, [currentUserQuery.data, currentUserQuery.isLoading, pathname, router]);
}
