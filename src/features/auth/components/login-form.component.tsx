"use client";

import { toast } from "sonner";
import { getErrorMessage } from "@/shared/lib/get-error-message";

import { useSignInMutation } from "../hooks/auth.mutations";
import type { AuthProvider } from "../types/auth.type";
import GitHubButton from "./github-button.component";
import GitlabButton from "./gitlab-button.component";

export default function LoginForm() {
  const signInMutation = useSignInMutation();
  const pendingProvider = signInMutation.variables;

  const handleSignIn = async (provider: AuthProvider) => {
    try {
      await signInMutation.mutateAsync(provider);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to sign in"));
    }
  };

  return (
    <div className="flex items-center justify-center pb-5 md:pb-0">
      <div className="w-full max-w-md">
        <div className="fade-in-0 slide-in-from-bottom-1 animate-in p-4 blur-in-[10px] duration-500 ease-out">
          <div className="mb-7 text-center">
            <h1 className="mb-2 text-xl tracking-[-0.04em] sm:text-2xl">
              Welcome to OpenSource Together
            </h1>
            <p className="mt-0 text-muted-foreground text-sm">
              New here or coming back? Choose how you want to continue
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <GitHubButton
              onClick={() => void handleSignIn("github")}
              isLoading={
                signInMutation.isPending && pendingProvider === "github"
              }
              disabled={signInMutation.isPending}
            />
            <GitlabButton
              onClick={() => void handleSignIn("gitlab")}
              isLoading={
                signInMutation.isPending && pendingProvider === "gitlab"
              }
              disabled={signInMutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
