import { Metadata } from "next";

import LoginView from "@/features/auth/views/login.view";

export const metadata: Metadata = {
  title: "Connexion | OpenSource Together",
  description:
    "Connectez-vous à votre compte GitHub pour continuer à utiliser OpenSource Together",
};

export default function LoginPage() {
  return <LoginView />;
}
