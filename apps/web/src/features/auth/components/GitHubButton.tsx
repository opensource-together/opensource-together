"use client";

import Image from "next/image";

import useAuth from "@/features/auth/hooks/useAuth";

import { Button } from "@/components/ui/button";

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

  const isOutlineVariant = variant === "outline";

  return (
    <Button
      onClick={() => signInWithGitHub()}
      disabled={isLoading}
      variant={isOutlineVariant ? "outline" : "default"}
      size="lg"
      className="w-[420px] text-base"
    >
      <span>{text}</span>

      {isLoading ? (
        <div
          className={`size-4 animate-spin rounded-full border-2 ${
            isOutlineVariant ? "border-black/10" : "border-white"
          } border-t-transparent`}
        />
      ) : (
        <Image
          src={
            isOutlineVariant ? "/icons/github.svg" : "/icons/github-white.svg"
          }
          alt="GitHub"
          width={16}
          height={16}
        />
      )}
    </Button>
  );
}
