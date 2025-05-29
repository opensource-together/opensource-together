import Session from "supertokens-web-js/recipe/session";
import {
  getAuthorisationURLWithQueryParamsAndSetState,
  signInAndUp,
} from "supertokens-web-js/recipe/thirdparty";

export async function signInWithGitHub(): Promise<void> {
  try {
    const authUrl = await getAuthorisationURLWithQueryParamsAndSetState({
      thirdPartyId: "github",
      frontendRedirectURI: "http://localhost:3000/auth/callback/github",
    });

    window.location.assign(authUrl);
  } catch (error) {
    console.error(error);
  }
}

export async function redirectAfterGitHub(): Promise<void> {
  try {
    const response = await signInAndUp();
    if (response.status === "OK" && (await Session.doesSessionExist())) {
      window.location.href = "/";
    } else if (response.status === "NO_EMAIL_GIVEN_BY_PROVIDER") {
      window.alert(
        "GitHub n'a pas fourni d'adresse email. Veuillez réessayer ou utiliser une autre méthode."
      );
      window.location.href = "/auth/login";
    } else {
      window.alert("Oops! Something went wrong.");
      window.location.href = "/auth/login";
    }
  } catch (error) {
    console.error(error);
  }
}
