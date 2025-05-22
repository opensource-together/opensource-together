"use client";

import { useEffect } from "react";
import SuperTokens from "supertokens-web-js";
import EmailPassword from "supertokens-web-js/recipe/emailpassword";
import Session from "supertokens-web-js/recipe/session";
import ThirdParty from "supertokens-web-js/recipe/thirdparty";

export function SuperTokensInitializer() {
  useEffect(() => {
    // Ce code s'exécutera uniquement côté client, après le montage du composant.
    console.log("SuperTokensInitializer");
    SuperTokens.init({
      appInfo: {
        appName: "OST",
        apiDomain: "http://localhost:4000",
        apiBasePath: "/auth",
        // websiteDomain est généralement requis aussi pour la redirection
        // Assurez-vous que websiteDomain est correctement configuré si besoin pour les redirections
      },
      recipeList: [EmailPassword.init(), Session.init(), ThirdParty.init()],
    });
  }, []); // Le tableau de dépendances vide assure une exécution unique après le montage initial

  // Ce composant n'a pas besoin de rendre de JSX visible,
  // son but est uniquement d'exécuter l'initialisation de SuperTokens côté client.
  return null;
}
