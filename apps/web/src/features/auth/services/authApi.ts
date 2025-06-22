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
  try {
    const response = await signInAndUp();
    const sessionExists = await Session.doesSessionExist();

    if (response.status === "OK" && sessionExists) {
      return { success: true };
    }

    if (response.status === "NO_EMAIL_GIVEN_BY_PROVIDER") {
      throw new Error("GitHub didn't provide an email");
    }

    if (!sessionExists) {
      throw new Error("The session couldn't be created after login.");
    }

    throw new Error("An error occurred during the login.");
  } catch (err) {
    console.error("handleGitHubCallback error:", err);
    throw new Error("Error during the login via GitHub.");
  }
}
