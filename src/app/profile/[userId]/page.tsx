import { Metadata } from "next";
import { redirect } from "next/navigation";

import { FRONTEND_URL } from "@/config/config";

import CTAFooter from "@/shared/components/layout/cta-footer";

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
  try {
    const user = await getUserById(userId);

    const userUrl = `${FRONTEND_URL.replace(/\/$/, "")}/profile/${userId}`;

    return {
      title: `${user.name} | OpenSource Together`,
      description: user.bio,
      openGraph: {
        title: `${user.name} | OpenSource Together`,
        description: user.bio,
        images: [
          {
            url: `${userUrl}/opengraph-image`,
            width: 1200,
            height: 630,
            alt: `${user.name} profile preview`,
          },
        ],
        url: userUrl,
        type: "website",
        siteName: "OpenSource Together",
        locale: "fr_FR",
        countryName: "France",
      },
    };
  } catch (error) {
    console.error("generateMetadata user fetch failed:", error);
    return {
      title: "User | OpenSource Together",
      description: "Discover open source users on OpenSource Together.",
    };
  }
}

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { userId } = await params;

  const currentUser = await getCurrentUser().catch(() => null);
  if (currentUser && currentUser.id === userId) {
    console.log("Redirecting to /profile/me");
    redirect("/profile/me");
  }

  return (
    <>
      <PublicProfileView userId={userId} />
      <CTAFooter imageIllustration="/illustrations/magician.png" />
    </>
  );
}
