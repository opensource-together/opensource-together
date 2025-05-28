"use client";

import GitHubButton from "./GitHubButton";
import WhiteGitHubButton from "./WhiteGitHubButton";

export default function SignUpForm() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <GitHubButton text="Se connecter avec GitHub" />
        <WhiteGitHubButton text="S'inscrire avec GitHub" />
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Déjà un compte ?{" "}
          <a
            href="/auth/signin"
            className="font-medium text-blue-600 transition-colors hover:text-blue-500"
          >
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
}
