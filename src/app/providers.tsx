"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import type { ReactNode } from "react";

import { OnboardingRedirect } from "@/features/auth/components/onboarding-redirect.component";
import { MockSessionToggle } from "@/mocks/provider.mock";
import { getQueryClient } from "@/shared/lib/query-client";

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
      <OnboardingRedirect />
      <ReactQueryDevtools initialIsOpen={false} />
      <MockSessionToggle />
    </QueryClientProvider>
  );
}
