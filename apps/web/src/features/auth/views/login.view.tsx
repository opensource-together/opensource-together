"use client";

import Image from "next/image";
import Link from "next/link";

import AuthIllustration from "../components/auth-illustration.component";
import LoginForm from "../components/login-form.component";

export default function LoginView() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Link href="/" className="absolute top-15 left-20 z-10">
        <Image
          src="/ostogether-logo.svg"
          alt="ost-logo"
          width={209}
          height={12}
          className="max-h-[16px] lg:max-h-[25px]"
        />
      </Link>

      <div className="absolute bottom-20 left-20 z-10 max-w-[500px]">
        <h1
          className="text-3xl leading-tight font-medium tracking-tighter text-black md:text-4xl"
          style={{ fontFamily: "Aspekta", fontWeight: 500 }}
        >
          Construisons ensemble <br /> l'avenir du développement
        </h1>
        <p className="mt-2 text-xs leading-relaxed font-normal text-black/50 md:text-sm">
          Trouvez des projets, postulez à des rôles, collaborez, construisons,
          partageons et grandissons ensemble grâce à l'open source
        </p>
      </div>

      <AuthIllustration />

      <div className="relative flex flex-1 flex-col justify-center">
        <div className="mx-8 flex flex-col items-center md:mx-28">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
