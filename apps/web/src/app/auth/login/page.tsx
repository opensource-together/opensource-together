"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import LoginView from "@/features/auth/views/login.view";

export default function LoginPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Stocker l'URL de redirection dans sessionStorage si elle existe
    const redirectUrl = searchParams?.get("redirect");
    if (redirectUrl) {
      const decodedRedirectUrl = decodeURIComponent(redirectUrl);
      sessionStorage.setItem("auth_redirect_url", decodedRedirectUrl);
    }
  }, [searchParams]);

  return <LoginView />;
}
