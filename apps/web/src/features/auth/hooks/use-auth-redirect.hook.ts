import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

/**
 * Hook séparé pour gérer la redirection depuis les search params
 * Utilisé uniquement dans les pages d'auth qui ont besoin de cette fonctionnalité
 */
export default function useAuthRedirect() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Gérer la sauvegarde de l'URL de redirection depuis les search params
  useEffect(() => {
    // Ignorer les search params sur les pages de callback GitHub
    // car ils contiennent les paramètres OAuth (code, state) et non une URL de redirection
    if (pathname?.includes("/auth/callback")) {
      return;
    }

    const redirectUrl = searchParams?.get("redirect");
    if (redirectUrl) {
      const decodedRedirectUrl = decodeURIComponent(redirectUrl);
      sessionStorage.setItem("auth_redirect_url", decodedRedirectUrl);
    }
  }, [searchParams, pathname]);
}
