import { Metadata } from "next";

import ProfileEditView from "@/features/profile/views/profile-edit.view";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Modifier mon profil | OpenSource Together",
    description: "Modifier mon profil sur OpenSource Together",
  };
}

export default function ProfileEditPage() {
  return <ProfileEditView />;
}
