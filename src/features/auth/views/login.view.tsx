"use client";

import Image from "next/image";
import Link from "next/link";

import FooterLogin from "@/shared/components/layout/footer-login";

import AuthIllustration from "../components/auth-illustration.component";
import LoginForm from "../components/login-form.component";

export default function LoginView() {
  return (
    <>
      <div className="relative flex min-h-screen flex-col overflow-hidden">
        <Link
          href="/"
          className="absolute top-7 left-0 z-10 md:top-12 md:left-1/2 md:-translate-x-1/2"
        >
          <Image
            src="/ostogether-logo.svg"
            alt="ost-logo"
            width={209}
            height={12}
            className="max-h-[16px] lg:max-h-[25px]"
          />
        </Link>

        {/* Mobile: show a dedicated top section with centered illustration */}
        <div className="relative top-30 z-0 w-full md:hidden">
          <AuthIllustration />
        </div>

        {/* Desktop+: background illustration covers behind content */}
        <div className="pointer-events-none absolute inset-0 z-0 hidden md:block">
          <AuthIllustration />
        </div>

        <div className="relative z-10 flex w-full flex-1 items-end px-4 pb-6 md:grid md:place-items-center md:pb-0">
          <div className="mx-auto w-full max-w-sm md:max-w-md">
            <LoginForm />
          </div>
        </div>
        <div className="mt-auto">
          <FooterLogin />
        </div>
      </div>
    </>
  );
}
