import { getProfileById } from "@/features/profile/services/profile.service";
import { PublicProfileView } from "@/features/profile/views/public-profile.view";

interface PublicProfilePageProps {
  params: {
    id: string;
  };
}

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  try {
    const profile = await getProfileById(params.id);
    return <PublicProfileView profile={profile} />;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return <PublicProfileView profile={null} />;
  }
}
