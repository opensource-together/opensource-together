import type { Metadata } from "next";

import LoginView from "@/features/auth/views/login.view";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your account to continue using OpenSource Together",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <LoginView />;
}
