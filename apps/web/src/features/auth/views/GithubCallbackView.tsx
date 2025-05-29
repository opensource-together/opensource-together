"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

import AuthIllustration from "../components/AuthIllustration";
import useAuth from "../hooks/useAuth";

export default function GithubCallbackView() {
  const { redirectAfterGitHub } = useAuth();

  useEffect(() => {
    redirectAfterGitHub();
  }, [redirectAfterGitHub]);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="relative flex min-h-[50vh] w-full items-center justify-center lg:min-h-full lg:w-3/4">
        <Image
          src="/icons/ost-logo-login.svg"
          alt="OpenSource Together Logo"
          width={210}
          height={35}
          className="absolute top-8 left-8"
        />

        <div className="flex flex-col items-center space-y-6 px-8 md:px-28">
          <div className="flex flex-col items-center space-y-3 text-center">
            <Loader2 className="h-12 w-12 animate-spin" />
            <h1 className="text-2xl font-medium">Connexion en cours...</h1>
            <p className="text-muted-foreground">
              Nous vérifions vos informations Github. Vous serez redirigé vers{" "}
              <span className="font-medium">OpenSource Together</span> dans
              quelques instants.
            </p>
          </div>
        </div>
      </div>

      <AuthIllustration />
    </div>
  );
}
