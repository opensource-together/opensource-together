import EmailPassword from "supertokens-web-js/recipe/emailpassword";
import Session from "supertokens-web-js/recipe/session";
import {
  getAuthorisationURLWithQueryParamsAndSetState,
  signInAndUp,
} from "supertokens-web-js/recipe/thirdparty";
export default function useAuth() {
  async function signUp(data: {
    email: string;
    password: string;
    username: string;
  }): Promise<void> {
    try {
      const response = await EmailPassword.signUp({
        formFields: [
          { id: "email", value: data.username },
          { id: "actualEmail", value: data.email },
          { id: "password", value: data.password },
        ],
      });

      if (response.status === "OK") {
        console.log("SuperTokens signUp OK pour", data.email);
        return;
      } else if (response.status === "FIELD_ERROR") {
        const errorMessage = response.formFields.map((f) => f.error).join(", ");
        console.error("Erreur de champ SuperTokens:", errorMessage);
        throw new Error(errorMessage);
      } else {
        console.error("Erreur SuperTokens signUp inattendue:", response);
        throw new Error("Une erreur inattendue est survenue l'inscription.");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      throw error;
    }
  }

  async function signInWithGitHub(): Promise<void> {
    try {
      const authUrl = await getAuthorisationURLWithQueryParamsAndSetState({
        thirdPartyId: "github",

        // This is where Google should redirect the user back after login or error.
        // This URL goes on the Google's dashboard as well.
        frontendRedirectURI: "http://localhost:3000/auth/callback/github",
      });

      /*
        Example value of authUrl: https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&access_type=offline&include_granted_scopes=true&response_type=code&client_id=1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com&state=5a489996a28cafc83ddff&redirect_uri=https%3A%2F%2Fsupertokens.io%2Fdev%2Foauth%2Fredirect-to-app&flowName=GeneralOAuthFlow
        */

      // we redirect the user to github for auth.
      window.location.assign(authUrl);
    } catch (err: any) {
      console.error(err);
      if (err.isSuperTokensGeneralError === true) {
        // this may be a custom error message sent from the API by you.
        window.alert(err.message);
      } else {
        window.alert("Oops! Something went wrong.");
      }
    }
  }

  async function redirect() {
    try {
      const response = await signInAndUp();
      console.log("SuperTokens thirdPartySignInAndUp response:", response); // Log pour débogage

      if (response.status === "OK") {
        console.log("Connexion/Inscription GitHub OK", response.user);
        if (await Session.doesSessionExist()) {
          window.location.href = "/profile";
        } else {
          console.error("Session does not exist after sign in/up OK");
          window.location.href = "/auth/signin";
        }
      } else if (response.status === "NO_EMAIL_GIVEN_BY_PROVIDER") {
        window.alert(
          "GitHub n'a pas fourni d'adresse email. Veuillez réessayer ou utiliser une autre méthode.",
        );
        window.location.href = "/auth/signin";
      } else {
        // Ajout d'un log plus détaillé de la réponse si ce n'est pas OK
        console.error("SuperTokens signInAndUp status not OK:", response);
        window.alert(
          "Une erreur est survenue lors de la connexion avec GitHub. Statut: " +
            response.status,
        );
        window.location.href = "/auth/signin";
      }
    } catch (err: any) {
      console.error("----------------------------------------------------");
      console.error("Error in GithubCallbackComponent (useAuth.ts):");
      console.error("Type of error:", typeof err);
      console.error("Error object itself:", err);
      if (err && typeof err === 'object') {
        console.error("Error keys:", Object.keys(err));
        if (err.message) {
          console.error("Error message:", err.message);
        }
        if (err.stack) {
          console.error("Error stack:", err.stack);
        }
        if (err.response) { // Si c'est une erreur de type fetch avec une réponse
          console.error("Error response (if any):", err.response);
          err.response.text().then((text: string) => console.error("Error response text:", text)).catch(() => {});
        }
      }
      console.error("Full error stringified (fallback):", JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
      console.error("----------------------------------------------------");

      if (err.isSuperTokensGeneralError === true) {
        window.alert(err.message);
      } else {
        window.alert(
          "Oops! Quelque chose s'est mal passé lors du callback GitHub. (Plus de détails en console)",
        );
      }
      window.location.href = "/auth/signin";
    }
  }
  return {
    signInWithGitHub,
    redirect,
    user: null,
    isLoading: false,
  };
}
