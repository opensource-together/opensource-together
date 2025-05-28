import Image from "next/image";
import Link from "next/link";

import AuthCard from "../components/AuthCard";
import AuthIllustration from "../components/AuthIllustration";
import LoginForm from "../components/LoginForm";

export default function LoginView() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="relative flex flex-1 flex-col justify-center">
        <Link href="/">
          <Image
            src="/icons/ost-logo-login.svg"
            alt="OpenSource Together Logo"
            width={210}
            height={35}
            className="absolute top-8 left-8"
          />
        </Link>

        <div className="mx-8 flex flex-col items-center md:mx-28">
          <AuthCard
            title="Bienvenue sur OpenSource Together"
            subtitle="Trouvez des projets, postulez à des rôles, collaborez — construissons, partageons et grandissons ensemble grâce à l'open source"
          >
            <LoginForm />
          </AuthCard>
        </div>

        <Link href="/" className="absolute bottom-8 left-8 font-medium">
          Contact Us
        </Link>
      </div>

      <AuthIllustration />
    </div>
  );
}
