"use client";

import GitHubButton from "./GitHubButton";
import WhiteGitHubButton from "./WhiteGitHubButton";

export default function LoginForm() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <GitHubButton text="Se connecter avec GitHub" />
        <WhiteGitHubButton text="S'inscrire avec GitHub" />
      </div>
    </div>
  );
}
