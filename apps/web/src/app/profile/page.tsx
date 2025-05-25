import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/queryClient";

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
    <HydrationBoundary state={dehydratedState}>
      <ProfileView />
    </HydrationBoundary>
  );
}
