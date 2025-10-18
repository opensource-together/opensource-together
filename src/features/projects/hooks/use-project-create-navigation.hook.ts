import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useProjectCreateStore } from "../stores/project-create.store";

/**
 * Handles navigation and redirection logic for the project creation flow.
 */
export function useProjectCreateNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { formData, hasHydrated } = useProjectCreateStore();

  useEffect(() => {
    if (!hasHydrated) return;

    const inCreateFlow = pathname.startsWith("/projects/create");
    if (!inCreateFlow) return;

    const providerMatch = pathname.match(
      /\/projects\/create\/(github|gitlab)\b/
    );
    const provider = providerMatch?.[1] as "github" | "gitlab" | undefined;

    const isRoot = pathname === "/projects/create";
    if (!isRoot && !formData.method) {
      router.replace("/projects/create");
      return;
    }

    if (provider) {
      if (formData.method !== provider) {
        router.replace("/projects/create");
        return;
      }

      const isConfirm = pathname.endsWith("/confirm");

      if (isConfirm && !formData.selectedRepository) {
        router.replace(`/projects/create/${provider}/import`);
        return;
      }

      return;
    }

    const isTechCategories = pathname.endsWith(
      "/projects/create/tech-categories"
    );

    if (isTechCategories) {
      const hasRequiredScratchData = Boolean(
        formData.title && formData.description
      );
      if (!hasRequiredScratchData) {
        router.replace("/projects/create/describe");
        return;
      }
    }
  }, [pathname, formData, router, hasHydrated]);
}
