import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/queryClient";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";

import { getCurrentUserProfile } from "@/features/profile/services/profileApi";
import ProfileView from "@/features/profile/views/ProfileView";

export default async function ProfilePage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["profile/me"],
    queryFn: () => getCurrentUserProfile(),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <ProtectedRoute>
      <HydrationBoundary state={dehydratedState}>
        <ProfileView />
      </HydrationBoundary>
    </ProtectedRoute>
  );
}
