"use client";

import useAuth from "@/features/auth/hooks/use-auth.hook";

import ProfileError from "../components/error-ui/profile-error.component";
import SkeletonProfileView from "../components/skeletons/skeleton-profile-view.component";
import ProfileEditForm from "../forms/profile-edit.form";

export default function ProfileEditView() {
  const { currentUser, isLoading, isError } = useAuth();

  if (isLoading) return <SkeletonProfileView />;
  if (isError || !currentUser) return <ProfileError />;

  return (
    <div className="mx-auto mt-12 max-w-[1300px]">
      <div className="mx-auto mt-2 mb-20 max-w-[1300px] px-4 sm:px-6 md:px-8 lg:px-24 xl:px-33">
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[350px_1fr] lg:gap-12">
          <div className="lg:contents">
            <ProfileEditForm profile={currentUser} />
          </div>
        </div>
      </div>
    </div>
  );
}
