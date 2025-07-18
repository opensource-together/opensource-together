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

    if (pathname.includes("/success")) return;

    const isStepRoute = pathname.match(/\/step-(one|two|three|four)$/);
    const hasMethod = formData.method !== null;

    if (isStepRoute && !hasMethod) {
      router.replace("/projects/create");
      return;
    }

    const isGithubStepTwoOrLater =
      pathname.includes("/github/step-two") ||
      pathname.includes("/github/step-three");

    if (isGithubStepTwoOrLater && !formData.selectedRepository) {
      router.replace("/projects/create/github/step-one");
      return;
    }

    const isScratchStepTwoOrLater =
      pathname.includes("/scratch/step-two") ||
      pathname.includes("/scratch/step-three") ||
      pathname.includes("/scratch/step-four");

    const hasRequiredScratchData =
      formData.title &&
      formData.shortDescription &&
      formData.keyFeatures?.length &&
      formData.projectGoals?.length;

    if (isScratchStepTwoOrLater && !hasRequiredScratchData) {
      router.replace("/projects/create/scratch/step-one");
      return;
    }

    const isScratchStepThreeOrLater =
      pathname.includes("/scratch/step-three") ||
      pathname.includes("/scratch/step-four");

    const hasRequiredStepTwoData =
      formData.techStack?.length && formData.categories?.length;

    if (isScratchStepThreeOrLater && !hasRequiredStepTwoData) {
      router.replace("/projects/create/scratch/step-two");
      return;
    }

    const isScratchStepFour = pathname.includes("/scratch/step-four");
    const hasRequiredStepThreeData = formData.roles?.length > 0;

    if (isScratchStepFour && !hasRequiredStepThreeData) {
      router.replace("/projects/create/scratch/step-three");
      return;
    }
  }, [pathname, formData, router, hasHydrated]);
}
