import { useRouter } from "next/navigation";

import useAuth from "@/features/auth/hooks/use-auth.hook";

/**
 * Custom hook to navigate to the profile of a user.
 * If the user clicked is the current user, redirect to /profile/me,
 * otherwise redirect to /profile/{userId}.
 */
export default function useProfileNavigation() {
  const router = useRouter();
  const { currentUser } = useAuth();

  const navigateToProfile = (userId: string) => {
    if (currentUser && userId === currentUser.id) {
      router.push("/profile/me");
    } else {
      router.push(`/profile/${userId}`);
    }
  };

  return { navigateToProfile };
}
