import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Session from "supertokens-web-js/recipe/session";
import {
  getAuthorisationURLWithQueryParamsAndSetState,
  signInAndUp,
} from "supertokens-web-js/recipe/thirdparty";

export async function signInWithGitHub(): Promise<void> {
  try {
    toast.loading("Redirection vers GitHub...");
    const authUrl = await getAuthorisationURLWithQueryParamsAndSetState({
      thirdPartyId: "github",
      frontendRedirectURI: "http://localhost:3000/auth/callback/github",
    });

    window.location.assign(authUrl);
  } catch (error) {
    toast.dismiss();
    toast.error("Erreur lors de la redirection vers GitHub");
    console.error(error);
  }
}

export function useRedirectAfterGitHub() {
  const router = useRouter();

  const redirect = async (): Promise<void> => {
    try {
      toast.loading("Vérification de vos informations GitHub...");
      const response = await signInAndUp();
      if (response.status === "OK" && (await Session.doesSessionExist())) {
        toast.dismiss();
        toast.success("Connexion réussie !");
        router.push("/");
      } else if (response.status === "NO_EMAIL_GIVEN_BY_PROVIDER") {
        toast.dismiss();
        toast.error(
          "GitHub n'a pas fourni d'adresse email. Veuillez réessayer ou utiliser une autre méthode."
        );
        router.push("/auth/login");
      } else {
        toast.dismiss();
        toast.error("Une erreur est survenue lors de la connexion");
        router.push("/auth/login");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Une erreur est survenue lors de la connexion");
      console.error(error);
      router.push("/auth/login");
    }
  };

  return redirect;
}
