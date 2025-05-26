"use client";

import GitHubButton from "./GitHubButton";

export default function SignUpForm() {
  return (
    <div className="space-y-6">
      <GitHubButton text="S'inscrire avec GitHub" />
      
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Déjà un compte ?{" "}
          <a 
            href="/auth/signin" 
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
} 