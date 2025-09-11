import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import CTAFooter from "@/shared/components/layout/cta-footer";
import { getQueryClient } from "@/shared/lib/query-client";

import { getCurrentUser } from "@/features/auth/services/auth.service";
import { getUserById } from "@/features/profile/services/profile.service";
import { PublicProfileView } from "@/features/profile/views/public-profile.view";

interface PublicProfilePageProps {
  params: Promise<{
    userId: string;
  }>;
}

export async function generateMetadata({
  params,
}: PublicProfilePageProps): Promise<Metadata> {
  const { userId } = await params;
  const user = await getUserById(userId);

  return {
    title: `${user.username} | OpenSource Together`,
    description: user.bio,
    openGraph: {
      title: `${user.username} | OpenSource Together`,
      description: user.bio,
      images: [user.avatarUrl || ""],
      url: `https://opensourcetogether.com/profile/${userId}`,
      type: "website",
      siteName: "OpenSource Together",
      locale: "fr_FR",
      countryName: "France",
    },
  };
}

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { userId } = await params;

  const currentUser = await getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    console.log("Redirecting to /profile/me");
    redirect("/profile/me");
  }

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
