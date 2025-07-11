"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useProjectCreateStore } from "@/features/projects/stores/project-create.store";

export default function ProjectCreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { formData, hasHydrated } = useProjectCreateStore();

  useEffect(() => {
    if (!hasHydrated) return;

    if (pathname.includes("/success")) return;

    const isStepRoute = pathname.includes("/step");
    const hasMethod = formData.method !== null;

    if (isStepRoute && !hasMethod) {
      router.replace("/projects/create");
    }

    const isGithubStep2OrLater =
      pathname.includes("/github/step-two") ||
      pathname.includes("/github/step-three");
    const isScratchStep2OrLater =
      pathname.includes("/scratch/step-two") ||
      pathname.includes("/scratch/step-three");

    if (isGithubStep2OrLater && !formData.selectedRepository) {
      router.replace("/projects/create/github/step-one");
    }

    if (
      isScratchStep2OrLater &&
      (!formData.title ||
        !formData.shortDescription ||
        !formData.keyFeatures?.length ||
        !formData.projectGoals?.length)
    ) {
      router.replace("/projects/create/scratch/step-one");
    }
  }, [pathname, formData, router, hasHydrated]);

  return <>{children}</>;
}
