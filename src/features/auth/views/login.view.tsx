"use client";

import Image from "next/image";
import Link from "next/link";

import AuthIllustration from "../components/auth-illustration.component";
import LoginForm from "../components/login-form.component";

export default function LoginView() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <Link href="/" className="absolute top-12 left-1/2 z-10 -translate-x-1/2">
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
          <LoginForm />
        </div>
      </div>
      {/* Footer is rendered globally; removed local instance to avoid duplicates */}
    </div>
  );
}
