"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Hook to manage tab navigation with URL synchronization
 * @param defaultTab - The default tab if no URL parameter is present
 * @returns An object containing the current tab and the function to change the tab
 */
export function useTabNavigation(defaultTab: string = "overview") {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const tab = searchParams.get("tab") || defaultTab;

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === defaultTab) {
      params.delete("tab");
    } else {
      params.set("tab", value);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return {
    tab,
    handleTabChange,
  };
}
