"use client";

import { useState } from "react";

import GitHubButton from "./github-button.component";
import GoogleButton from "./google-button.component";
import EmailLoginForm from "./email-login-form.component";
import { Button } from "@/shared/components/ui/button";

export default function LoginForm() {
  const [showEmailForm, setShowEmailForm] = useState(false);

  return (
    <div className="flex items-center">
      <div className="w-full max-w-md">
        <div className="p-4">
          <div className="mb-8 text-center tracking-tighter">
            <h1 className="mb-3 text-2xl font-medium text-gray-900">
              Bienvenue sur OpenSource Together
            </h1>
            <p className="mt-6 text-black/50">
              La plateforme qui connecte développeurs, designers et <br />
              créateurs à travers des projets open source.
            </p>
          </div>

          {showEmailForm ? (
            <div className="space-y-4">
              <EmailLoginForm />
              <div className="text-center">
                <button
                  onClick={() => setShowEmailForm(false)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  ← Retour aux options de connexion
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <GitHubButton text="Se connecter avec GitHub" />
              <GoogleButton variant="outline" text="Se connecter avec Google" />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Ou</span>
                </div>
              </div>

              <Button
                onClick={() => setShowEmailForm(true)}
                variant="outline"
                className="w-full"
              >
                Se connecter avec email
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
