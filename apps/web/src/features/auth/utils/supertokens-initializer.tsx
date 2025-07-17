"use client";

import { useEffect } from "react";
import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";
import ThirdParty from "supertokens-web-js/recipe/thirdparty";

import { API_BASE_URL } from "@/config/config";

import { setSuperTokensInitialized } from "../services/auth.service";

export function SuperTokensInitializer() {
  useEffect(() => {
    SuperTokens.init({
      appInfo: {
        appName: "OST",
        apiDomain: API_BASE_URL,
        apiBasePath: "/auth",
      },
      recipeList: [Session.init(), ThirdParty.init()],
    });

    // Mark SuperTokens as initialized
    setSuperTokensInitialized();
  }, []);

  return null;
}
