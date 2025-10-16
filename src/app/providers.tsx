"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import * as React from "react";
import { ReactNode } from "react";

import { getQueryClient } from "@/shared/lib/query-client";

import SearchModal from "@/features/projects/components/search-modal";

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
      <SearchModal open={isSearchOpen} onOpenChange={setIsSearchOpen} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
