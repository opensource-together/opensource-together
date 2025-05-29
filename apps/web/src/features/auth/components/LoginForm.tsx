"use client";

import GitHubButton from "./GitHubButton";

export default function LoginForm() {
  return (
    <div className="space-y-6">
      <GitHubButton text="Se connecter avec GitHub" />

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Pas encore de compte ?{" "}
          <a
            href="/auth/signup"
            className="font-medium text-blue-600 transition-colors hover:text-blue-500"
          >
            Créer un compte
          </a>
        </p>
      </div>
    </div>
  );
}
