"use client";

import Image from "next/image";

import useAuth from "@/features/auth/hooks/useAuth";

import { Button } from "@/components/ui/button";

interface GitHubButtonProps {
  text?: string;
  isLoading?: boolean;
}

export default function GitHubButton({
  text = "Continuer avec GitHub",
  isLoading = false,
}: GitHubButtonProps) {
  const { signInWithGitHub } = useAuth();

  return (
    <Button
      onClick={signInWithGitHub}
      disabled={isLoading}
      size="lg"
      className="w-[420px] text-base"
    >
      <span>{text}</span>

      {isLoading ? (
        <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        <Image
          src="/icons/github-white.svg"
          alt="GitHub"
          width={16}
          height={16}
        />
      )}
    </Button>
  );
}
