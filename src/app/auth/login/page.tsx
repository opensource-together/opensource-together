import { Metadata } from "next";

import LoginView from "@/features/auth/views/login.view";

export const metadata: Metadata = {
  title: "Sign in | OpenSource Together",
  description: "Sign in to your account to continue using OpenSource Together",
};

export default function LoginPage() {
  return <LoginView />;
}
