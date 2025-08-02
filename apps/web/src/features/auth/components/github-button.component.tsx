"use client";

import Image from "next/image";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";

import useAuth from "@/features/auth/hooks/use-auth.hook";

interface GitHubButtonProps {
  text?: string;
  isLoading?: boolean;
  variant?: "default" | "outline";
}

export default function GitHubButton({
  text = "Continuer avec GitHub",
  isLoading = false,
  variant = "default",
}: GitHubButtonProps) {
  const { signInWithGitHub } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const isOutlineVariant = variant === "outline";

  const handleGitHubSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGitHub();
    } catch (error) {
      console.error("GitHub sign in error:", error);
      // Gérer l'erreur (afficher un toast, etc.)
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <Button
      onClick={handleGitHubSignIn}
      disabled={isLoading || isSigningIn}
      variant={isOutlineVariant ? "outline" : "default"}
      size="lg"
      className={`w-[420px] text-base ${
        isOutlineVariant ? "border-none bg-[#FAFAF9]" : ""
      }`}
    >
      {isLoading || isSigningIn ? (
        <div
          className={`size-4 animate-spin rounded-full border-2 ${
            isOutlineVariant ? "border-black/10" : "border-white"
          } border-t-transparent`}
        />
      ) : (
        <Image
          src={
            isOutlineVariant
              ? "/icons/new-github-icon-black.svg"
              : "/icons/new-github-icon.svg"
          }
          alt="GitHub"
          width={16}
          height={16}
        />
      )}
      <span className="ml-0">{text}</span>
    </Button>
  );
}
