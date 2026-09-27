"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function useTabNavigation(
  defaultTab = "overview",
  validTabs?: string[]
) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  let tab = searchParams.get("tab") || defaultTab;
  if (validTabs && !validTabs.includes(tab)) {
    tab = defaultTab;
  }

  const [, startTransition] = useTransition();

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === defaultTab) {
      params.delete("tab");
    } else {
      params.set("tab", value);
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return {
    tab,
    handleTabChange,
  };
}
