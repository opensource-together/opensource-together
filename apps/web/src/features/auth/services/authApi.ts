import Session from "supertokens-web-js/recipe/session";
import {
  getAuthorisationURLWithQueryParamsAndSetState,
  signInAndUp,
} from "supertokens-web-js/recipe/thirdparty";

export async function getGitHubAuthUrl(): Promise<string> {
  return getAuthorisationURLWithQueryParamsAndSetState({
    thirdPartyId: "github",
    frontendRedirectURI: "http://localhost:3000/auth/callback/github",
  });
}

export async function handleGitHubCallback() {
  const response = await signInAndUp();
  const sessionExists = await Session.doesSessionExist();

  if (response.status === "OK" && sessionExists) {
    return { success: true };
  }

  if (response.status === "NO_EMAIL_GIVEN_BY_PROVIDER") {
    throw new Error("GitHub n'a pas fourni d'adresse email");
  }

  throw new Error("Une erreur est survenue lors de la connexion");
}
