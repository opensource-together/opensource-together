"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { ReactNode } from "react";

import { getQueryClient } from "@/shared/lib/query-client";

/**
 * Wraps child components with React Query context, streamed hydration, and devtools support.
 *
 * Provides the React Query client to all descendants, enables streamed hydration for server-rendered data, and includes React Query Devtools with the panel initially closed.
 *
 * @param children - The components to be rendered within the React Query context
 */
export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
