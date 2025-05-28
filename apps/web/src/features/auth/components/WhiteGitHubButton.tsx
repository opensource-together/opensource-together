"use client";

import Image from "next/image";

import useAuth from "@/features/auth/hooks/useAuth";

import { Button } from "@/components/ui/button";

interface WhiteGitHubButtonProps {
  text?: string;
  isLoading?: boolean;
}

export default function WhiteGitHubButton({
  text = "S'inscrire avec GitHub",
  isLoading = false,
}: WhiteGitHubButtonProps) {
  const { signInWithGitHub } = useAuth();

  return (
    <Button
      onClick={signInWithGitHub}
      disabled={isLoading}
      variant="outline"
      size="lg"
      className="w-[420px] text-base"
    >
      <span>{text}</span>

      {isLoading ? (
        <div className="size-4 animate-spin rounded-full border-2 border-black/10 border-t-transparent" />
      ) : (
        <Image src="/icons/github.svg" alt="GitHub" width={16} height={16} />
      )}
    </Button>
  );
}
