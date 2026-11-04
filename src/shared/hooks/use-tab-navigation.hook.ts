"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { resolveTab } from "@/shared/lib/utils/resolve-tab";

export function useTabNavigation(
  defaultTab: string,
  allowedTabs: readonly string[]
) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const tab = resolveTab(searchParams.get("tab"), defaultTab, allowedTabs);

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
