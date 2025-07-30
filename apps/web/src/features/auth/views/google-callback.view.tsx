"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

import AuthIllustration from "../components/auth-illustration.component";
import useAuth from "../hooks/use-auth.hook";

export default function GoogleCallbackView() {
  const { redirectAfterGoogle } = useAuth();

  useEffect(() => {
    redirectAfterGoogle();
  }, [redirectAfterGoogle]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Logo en position absolue, à gauche de l'écran */}
      <div className="absolute top-15 left-20 z-10">
        <Image
          src="/ostogether-logo.svg"
          alt="ost-logo"
          width={209}
          height={12}
          className="max-h-[16px] lg:max-h-[25px]"
        />
      </div>

      {/* Textes en bas à gauche */}
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
          <div className="flex flex-col items-center space-y-6 text-center">
            <Loader2 className="h-12 w-12 animate-spin" />
            <h1 className="text-2xl font-medium">Connexion en cours...</h1>
            <p className="text-muted-foreground w-[500px] text-sm leading-relaxed">
              Nous vérifions vos informations Google. Vous serez redirigé vers{" "}
              <span className="font-medium">OpenSource Together</span> dans
              quelques instants.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
