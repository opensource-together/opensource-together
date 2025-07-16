"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

import AuthIllustration from "../components/auth-illustration.component";
import AuthRedirectHandler from "../components/auth-redirect-handler.component";
import useAuth from "../hooks/use-auth.hook";

export default function GithubCallbackView() {
  const { redirectAfterGitHub } = useAuth();

  useEffect(() => {
    redirectAfterGitHub();
  }, [redirectAfterGitHub]);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Composant qui gère la redirection depuis les search params */}
      <AuthRedirectHandler />

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
            <p className="text-muted-foreground text-sm">
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
