import { Metadata } from "next";

import ProfileEditView from "@/features/profile/views/profile-edit.view";

export const metadata: Metadata = {
  title: "Edit My Profile",
  description: "Edit your profile on OpenSource Together",
};

export default function ProfileEditPage() {
  return <ProfileEditView />;
}
