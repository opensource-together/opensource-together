import Image from "next/image";
import Link from "next/link";

import AuthIllustration from "../components/auth-illustration.component";
import LoginForm from "../components/login-form.component";

/**
 * Renders the login page layout with a logo, login form, contact link, and an authentication illustration.
 *
 * The layout adapts responsively for different screen sizes, displaying the login form and illustration side by side on larger screens and stacked on smaller screens.
 */
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
          <LoginForm />
        </div>

        <Link href="/" className="absolute bottom-8 left-8 font-medium">
          Contactez-nous
        </Link>
      </div>

      <AuthIllustration />
    </div>
  );
}
