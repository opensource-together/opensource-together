import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import CTAFooter from "@/shared/components/layout/cta-footer";
import { getQueryClient } from "@/shared/lib/query-client";

import { getUserById } from "@/features/profile/services/profile.service";
import { PublicProfileView } from "@/features/profile/views/public-profile.view";

interface PublicProfilePageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { userId } = await params;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <HydrationBoundary state={dehydratedState}>
        <PublicProfileView userId={userId} />
      </HydrationBoundary>
      <CTAFooter imageIllustration="/illustrations/hooded-man.png" />
    </>
  );
}
