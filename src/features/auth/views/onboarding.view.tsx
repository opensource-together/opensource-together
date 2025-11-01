"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import FooterLogin from "@/shared/components/layout/footer-login";

import useAuth from "@/features/auth/hooks/use-auth.hook";

import AuthIllustration from "../components/auth-illustration.component";
import OnboardingForm from "../components/onboarding-form.component";

export default function OnboardingView() {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  const isOnboardingCompleted =
    !!currentUser &&
    (!!currentUser.jobTitle ||
      (currentUser.userTechStacks?.length ?? 0) > 0 ||
      (currentUser.userCategories?.length ?? 0) > 0);

  useEffect(() => {
    if (isOnboardingCompleted) {
      router.replace("/");
    }
  }, [isOnboardingCompleted, router]);

  if (isLoading || !currentUser) return null;
  if (isOnboardingCompleted) return null;

  return (
    <>
      <div className="relative flex min-h-screen flex-col overflow-hidden">
        <Link
          href="/"
          className="absolute top-12 left-1/2 z-10 -translate-x-1/2"
        >
          <Image
            src="/ostogether-logo.svg"
            alt="ost-logo"
            width={209}
            height={12}
            className="max-h-[16px] lg:max-h-[25px]"
          />
        </Link>

        <div className="pointer-events-none absolute inset-0 z-0">
          <AuthIllustration />
        </div>

        <div className="relative z-10 grid w-full flex-1 place-items-center px-4">
          <div className="mx-auto w-full max-w-sm md:max-w-md">
            <OnboardingForm />
          </div>
        </div>
        <div className="mt-auto px-4 md:px-10">
          <FooterLogin />
        </div>
      </div>
    </>
  );
}
