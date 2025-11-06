import { Metadata } from "next";

import ProfileEditView from "@/features/profile/views/profile-edit.view";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Edit my profile",
    description: "Edit my profile on OpenSource Together",
  };
}

export default function ProfileEditPage() {
  return <ProfileEditView />;
}
