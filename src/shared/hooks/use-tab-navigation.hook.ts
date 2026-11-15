"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useTabNavigation(
  defaultTab: string,
  allowedTabs: readonly string[]
) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const requestedTab = searchParams.get("tab");
  const tab =
    requestedTab && allowedTabs.includes(requestedTab)
      ? requestedTab
      : defaultTab;

  const handleTabChange = (value: string) => {
    if (!allowedTabs.includes(value)) return;

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
