"use client";

import { useEffect } from "react";
import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";
import ThirdParty from "supertokens-web-js/recipe/thirdparty";

export function SuperTokensInitializer() {
  useEffect(() => {
    console.log("SuperTokensInitializer");
    SuperTokens.init({
      appInfo: {
        appName: "OST",
        apiDomain: "http://localhost:4000",
        apiBasePath: "/auth",
      },
      recipeList: [Session.init(), ThirdParty.init()],
    });
  }, []);

  return null;
}
